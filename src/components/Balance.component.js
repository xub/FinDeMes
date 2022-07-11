/**
 * PWA FinDeFes
 * update 07/2022
 * By Sergio Sam 
 */

import React from 'react';
import { useState, useEffect } from 'react'

import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';
import { Modal, Button } from '@mui/material';
import { useTheme, useStyles } from "./styles.js"
import { Grid, ThemeProvider, StyledEngineProvider } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';

import MaterialTable from 'material-table';

import { useHistory } from "react-router-dom";
 
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

let direction = "ltr";

export default function Balance() {
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(undefined);
  const [showClienteBoard, setShowClienteBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);

  const styles = useStyles();
  const classes = useStyles();
  const theme = useTheme;
  const [modalEliminar, setModalEliminar] = useState(false);
  const [data, setData] = useState([]);
  const [consolaSeleccionada, setConsolaSeleccionada] = useState({
    id: '',
    nombre: '',
    codigo: '',
  })

  const peticionDelete = async () => {
    const response = await UserService.delMovimiento(consolaSeleccionada.id);
    var data = response.data;
    //setData(data.filter(consola => consola.id !== consolaSeleccionada.id));
    peticionGet();
    //totalT();
    abrirCerrarModalEliminar();
  }

  const peticionGet = async () => {
    const result = await UserService.getBalance();
    setData(result);
  }

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  }

  const seleccionarConsola = (consola, caso) => {
    setConsolaSeleccionada(consola);
    (caso === 'Editar') ?
      history.push(process.env.PUBLIC_URL + "/balancemod/" + consola.id) :
      abrirCerrarModalEliminar()
  }

  const inicio = () => {
    history.push(process.env.PUBLIC_URL + "/")
  }

  useEffect(() => {

    // si no hay user hay que loguearse 
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setShowClienteBoard(user.roles.includes("ROLE_USER"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    } else {
      history.push(process.env.PUBLIC_URL + "/login");
    }

    const GetBalance = async () => {
      try {
        setIsLoading(true);
        const result = await UserService.getBalance();
        if (result) {
          setData(result);
          setIsLoading(false);
        } else {
          history.push(process.env.PUBLIC_URL + "/login");
        }
      } catch (e) {
        history.push(process.env.PUBLIC_URL + "/login");
      }
    }
    GetBalance();

  }, []);

  const bodyEliminar = (
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar el Movimiento <b>{consolaSeleccionada && consolaSeleccionada.nombre}</b> ? </p>
      <div align="right">
        <Button color="secondary" onClick={() => peticionDelete()} >Sí</Button>
        <Button onClick={() => abrirCerrarModalEliminar()}>No</Button>
      </div>
    </div>
  )

  return (
    <Paper className={classes.root}>

      <CssBaseline />

      <AppBar style={{ background: '#fff159', alignItems: 'center' }} position="static">
        <Toolbar>
          {isLoading && <CircularProgress color="secondary" />}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon style={{ color: '#000' }} onClick={() => inicio()} />
          </IconButton>
          <Typography variant="h4" component="div" style={{ color: '#000' }} sx={{ flexGrow: 1 }}>
            Balance
          </Typography>
        </Toolbar>
      </AppBar>


      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <div style={{ maxWidth: "100%", direction }}>
            <Grid container>
              <Grid item xs={12}>

                <MaterialTable
                  title=""

                  localization={{
                    toolbar: {
                      searchPlaceholder: 'Buscar...'
                    },
                    header: {
                      actions: 'Acciones'
                    },
                    body: {
                      editRow: {
                        deleteText: 'Estas seguro de eliminar este registro ?'
                      }
                    },

                  }}

                  columns={[
                    {
                      title: 'Fecha',
                      field: 'fecha',
                      type: 'date',
                      defaultSort: 'desc',
                    },
                    {
                      title: 'Nombre',
                      field: 'nombre',
                    },
                    {
                      title: 'Importe',
                      field: 'importe',
                      align: "center",
                      cellStyle: { textAlign: "center" }
                    },
                    {
                      title: 'Categoria',
                      field: 'categoria',
                      align: "center",
                      cellStyle: { textAlign: "center" }
                    },
                  ]}
                  data={data}
                  actions={[
                    {
                      icon: 'edit',
                      tooltip: 'Editar',
                      onClick: (event, data) => seleccionarConsola(data, 'Editar'),
                    },
                    {
                      icon: 'delete',
                      tooltip: 'Eliminar',
                      onClick: (event, data) => seleccionarConsola(data, 'Eliminar'),
                    }
                  ]}
                  options={{
                    headerStyle: {
                      backgroundColor: '#fff159',
                      color: '#000',
                    },
                    search: true,
                    actionsColumnIndex: -1
                  }}
                />

              </Grid>
            </Grid>
          </div>
        </ThemeProvider>
      </StyledEngineProvider>

      <Modal
        open={modalEliminar}
        onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
      </Modal>

    </Paper>
  );
}
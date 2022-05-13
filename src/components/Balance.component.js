/**
 * PWA FinDeFes
 * update 04/2022
 * By Sergio Sam 
 */

import React from 'react';
import { useState, useEffect } from 'react'

import { makeStyles } from '@mui/styles';

import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';
import { Modal, Button } from '@mui/material';

import {
  Grid,
  ThemeProvider,
  StyledEngineProvider,
  adaptV4Theme,
} from "@mui/material";

import { createTheme } from "@mui/material/styles";

import MaterialTable from 'material-table';

import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

let direction = "ltr";

const theme = createTheme(
  adaptV4Theme({
    direction: direction,
    palette: {
      mode: "light",
    },
  })
);

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: '#fff',
    border: '2px solid #000',
    boxShadow: 5,
    padding: (2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos: {
    cursor: 'pointer'
  },
  inputMaterial: {
    width: '100%'
  }
}));

export default function Balance(props) {
 
  const [currentUser, setCurrentUser] = useState(undefined);
  const [showClienteBoard, setShowClienteBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);

  const styles = useStyles();
  const classes = useStyles();
  const [modalEliminar, setModalEliminar] = useState(false);
  const [data, setData] = useState([]);
  const [consolaSeleccionada, setConsolaSeleccionada] = useState({
    id: '',
    nombre: '',
    codigo: '',
  })

  const peticionGet = async () => {
    const result = await UserService.getBalance();
    setData(result);
  }

  const peticionDelete = async () => {
    const response = await UserService.delMovimiento(consolaSeleccionada.id);
    var data = response.data;
    //setData(data.filter(consola => consola.id !== consolaSeleccionada.id));
    peticionGet();
    //totalT();
    abrirCerrarModalEliminar();
  }

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  }

  const seleccionarConsola = (consola, caso) => {
    setConsolaSeleccionada(consola);
    (caso === 'Editar') ?
      props.history.push(process.env.PUBLIC_URL + "/balancemod/" + consola.id) :
      abrirCerrarModalEliminar()
  }

  const inicio = () => {
    props.history.push(process.env.PUBLIC_URL + "/")
  }

  useEffect(() => {

    // si no hay user hay que loguearse 
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setShowClienteBoard(user.roles.includes("ROLE_USER"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    } else {
      props.history.push(process.env.PUBLIC_URL + "/login");
    }

    const GetBalance = async () => {
      try {
        const result = await UserService.getBalance();
        if (result) {
          setData(result);
        } else {
          props.history.push(process.env.PUBLIC_URL + "/login");
        }
      } catch (e) {
        props.history.push(process.env.PUBLIC_URL + "/login");
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
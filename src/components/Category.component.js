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
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useHistory } from "react-router-dom";

import { Modal, Button } from '@mui/material';
import { useTheme, useStyles } from "./styles.js"
import { Grid, ThemeProvider, StyledEngineProvider } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';

import MaterialTable from 'material-table';

import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

let direction = "ltr";

export default function Category() {
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(true)
  const [currentUser,setCurrentUser] = useState(undefined);
  const [showclientboard,setShowClienteBoard] = useState(false);
  const [adminborad,setShowAdminBoard] = useState(false);

  const styles = useStyles();
  const classes = useStyles();
  const theme = useTheme;

  const [data, setData] = useState([]);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [consolaSeleccionada, setConsolaSeleccionada] = useState({
    nombre: '',
    codigo: '',
  })

  const peticionDelete = async () => {
    await UserService.delCategory(consolaSeleccionada.id);
    peticionGet();
    abrirCerrarModalEliminar();
  }

  const peticionGet = async () => {
    const result = await UserService.getCategories();
    setData(result);
  }

  const abrirCerrarModalInsertar = () => {
    history.push(process.env.PUBLIC_URL + "/categoryaddmod/")
  }

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  }

  const seleccionarConsola = (consola, caso) => {
    setConsolaSeleccionada(consola);
    (caso === 'Editar') ? history.push(process.env.PUBLIC_URL + "/categoryaddmod/" + consola.id) : abrirCerrarModalEliminar()
  }

  const bodyEliminar = (
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar la Categoria <b>{consolaSeleccionada && consolaSeleccionada.nombre}</b> ? </p>
      <div align="right">
        <Button color="secondary" onClick={() => peticionDelete()} >Sí</Button>
        <Button onClick={() => abrirCerrarModalEliminar()}>No</Button>
      </div>
    </div>
  )

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

    const GetCategories = async () => {
      try {
        setIsLoading(true);
        const result = await UserService.getCategories();
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
    GetCategories();

  }, []);

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
            Categorias
          </Typography>
        </Toolbar>
      </AppBar>

      <br />
      <Breadcrumbs aria-label="breadcrumb">
        <Button style={{ color: "#000", backgroundColor: "#fff159" }} variant="contained" onClick={() => abrirCerrarModalInsertar()}>Nueva Categoria</Button>
      </Breadcrumbs>

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
                      title: 'Categoria',
                      field: 'nombre',
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

                <Modal
                  open={modalEliminar}
                  onClose={abrirCerrarModalEliminar}>
                  {bodyEliminar}
                </Modal>

              </Grid>
            </Grid>
          </div>
        </ThemeProvider>
      </StyledEngineProvider>

    </Paper>
  );
}
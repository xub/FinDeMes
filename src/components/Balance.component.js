/**
 * PWA FinDeFes
 * update 04/2022
 * By Sergio Sam 
 */

import React from 'react';
import { useState, useEffect } from 'react'

import { makeStyles } from '@mui/styles';

import Paper from '@mui/material/Paper';
import { Modal, Button } from '@mui/material';

import Breadcrumbs from '@mui/material/Breadcrumbs';

import {
  Grid,
  ThemeProvider,
  StyledEngineProvider,
  adaptV4Theme,
} from "@mui/material";

import { createTheme } from "@mui/material/styles";

import MaterialTable from 'material-table';

import UserService from "../services/user.service";

import { useQuery, useQueryClient } from 'react-query'

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

  const styles = useStyles();
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [consolaSeleccionada, setConsolaSeleccionada] = useState({
    nombre: '',
    codigo: '',
  })

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

  const queryClient = useQueryClient();

  const balanceQuery = useQuery(['balance','id'], () => UserService.getBalance(),
    {
      initialData: () => {
        // Get the query state
        const state = queryClient.getQueryState(['balance','id'])

        // If the query exists and has data that is no older than 10 seconds...
        if (state && Date.now() - state.dataUpdatedAt <= 10 * 1000) {
          // return the individual todo
          return state.data()
        }
      }, 
      staleTime: Infinity,
    });

  const peticionGet = async () => {
    const result = await UserService.getBalance();
    setData(result.data);
  }

  const peticionDelete = async () => {
    const response = await UserService.delMovimiento(consolaSeleccionada.id);
    var data = response.data;
    setData(data.filter(consola => consola.id !== consolaSeleccionada.id));
    peticionGet();
    //totalT();
    abrirCerrarModalEliminar();
  }

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

      <Breadcrumbs aria-label="breadcrumb">
        <Button style={{ color: "#fff", backgroundColor: "#2e7d32", }} variant="contained" onClick={() => inicio()}>Inicio</Button>
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

                  data={balanceQuery.data}
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
                      backgroundColor: '#2e7d32',
                      color: '#FFF',
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
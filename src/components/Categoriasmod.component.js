/**
 * PWA FinDeFes
 * update 04/2022
 * By Sergio Sam 
 */

import React from 'react';
import { useState, useEffect } from 'react'
import { useParams } from 'react-router';

import { makeStyles } from '@mui/styles';

import Paper from '@mui/material/Paper';
import { Button, TextField } from '@mui/material/';

import Grid from '@mui/material/Grid';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { useFormik } from 'formik';
import * as yup from 'yup';

import UserService from "../services/user.service";

import AuthService from "../services/auth.service";
import { useOnlineStatus } from "./useOnlineStatus";

//Validacion del formulario
const validationSchema = yup.object({
  nombre: yup
    .string('Nombre de la categoria requerido')
    .required('Nombre de la categoria requerido'),
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
  modal: {
    backgroundColor: '#fff',
    border: '2px solid #000',
    boxShadow: 5,
    padding: (2, 4, 3),
  },
  iconos: {
    cursor: 'pointer'
  },
  inputMaterial: {
    width: '100%'
  }
}));

export default function Categoriasmod(props) {
  const isOnline = useOnlineStatus();

  const [columns, setColumns] = useState([
    {
      id: 'Id',
      field: 'id',
      hidden: true,
    },
    {
      title: 'Nombre',
      field: 'nombre'
    },
  ]);

  //  const [data, setData] = useState([
  //    { nombre: 'Mehmet' },
  //    { nombre: 'Zerya Betül' },
  //  ]);
  const [data, setData] = useState([]);

  //inicializacion de variables y validacion
  const formik = useFormik({
    initialValues: {
      nombre: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      peticionPost(values);
    },
  });

  const [currentUser, setCurrentUser] = useState(undefined);
  const [showClienteBoard, setShowClienteBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);

  const { id } = useParams();

  const styles = useStyles();
  const classes = useStyles();

  const [datos, setDatos] = useState([]);

  const peticionPost = async (values) => {
    const response = await UserService.addmodCategoria(id, values);
    cerrarEditar()
  }

  const cerrarEditar = () => {
    props.history.push(process.env.PUBLIC_URL + "/categorias");
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

    const GetData = async () => {
      try {
        const response = await UserService.getCategories(id);
        if (response) {
          var dataNueva = response.data;
          dataNueva.map(consola => {
            formik.initialValues.nombre = consola.nombre;
          })

          setDatos(dataNueva);
        } else {
          props.history.push(process.env.PUBLIC_URL + "/login");
        }
      } catch (e) {
        props.history.push(process.env.PUBLIC_URL + "/login");
      }
    }
    GetData();

  }, []);

  const inicio = () => {
    props.history.push(process.env.PUBLIC_URL + "/")
  }

  return (
    <Paper className={classes.root}>

      <Breadcrumbs aria-label="breadcrumb">
        <Button style={{ color: "#fff", backgroundColor: "#2e7d32", }} variant="contained" onClick={() => inicio()}>Inicio</Button>
      </Breadcrumbs>

      <div className={styles.modal}>
        <form onSubmit={formik.handleSubmit}>
          <h3>Editar Categoria</h3>

          <Grid container spacing={3}>

            <Grid item xs={6}>
              <TextField
                name="nombre"
                className={styles.inputMaterial}
                label="Categoria"
                required
                value={formik.values.nombre}
                onChange={formik.handleChange}
                error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                helperText={formik.touched.nombre && formik.errors.nombre}
              />
            </Grid>

          </Grid>

          <div align="right">
            <Button color="primary" type="submit">Editar</Button>
            <Button color="primary" onClick={() => cerrarEditar()}>Cancelar</Button>
          </div>
        </form>


      </div>
    </Paper>
  );
}
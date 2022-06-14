/**
 * PWA FinDeFes
 * update 04/2022
 * By Sergio Sam 
 */

import React from 'react';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react'

import { makeStyles } from '@mui/styles';

import Paper from '@mui/material/Paper';
import { Modal, Button, TextField } from '@mui/material';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TextareaAutosize from '@mui/material/TextareaAutosize';

import { useFormik } from 'formik';
import * as yup from 'yup';

import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

//Validacion del formulario
const validationSchema = yup.object({
  nombre: yup
    .string('Nombre de categoria requerido')
    .required('Nombre de categoria requerido'),
});

const useStyles = makeStyles((theme) => ({

  body: {
    backgroundColor: '#fff159',
  },
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
  modal1: {
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
  modal: {
    backgroundColor: '#fff',
    border: '2px solid #000',
    boxShadow: '5',
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

  //inicializacion de variables y validacion
  const formik = useFormik({
    initialValues: {
      nombre: '',
      nota: '',
      id: '',
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

  const peticionPost = async (values) => {
    await UserService.addModCategory(id, values);
    cerrarEditar()
  }

  const cerrarEditar = () => {
    props.history.push(process.env.PUBLIC_URL + "/categorias");
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

    const GetData = async () => {
      try {
        const response = await UserService.getCategory(id);
        formik.setValues(response);
      } catch (e) {
        props.history.push(process.env.PUBLIC_URL + "/login");
      }
    }
    GetData();

  }, []);

  return (

    <Paper>

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
            Modificar Categoria
          </Typography>
        </Toolbar>
      </AppBar>

      <Container fixed>
        <Box sx={{ bgcolor: '#cfe8fc', height: '100vh', display: 'flex' }} >

          <form onSubmit={formik.handleSubmit}>

            <Grid container spacing={3} style={{ minHeight: '100vh' }} >

              <Grid item xs={12}>
                <TextField
                  name="nombre"
                  className={styles.inputMaterial}
                  label="Nomre de categoria"
                  autoFocus={true}
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                  helperText={formik.touched.nombre && formik.errors.nombre}
                />
              </Grid>
              <Grid item xs={12}>
                <div align="center" style={{ background: '#fff159' }} >
                  <Button color="primary" type="submit">Modificar</Button>
                </div>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </Paper>
  );
}


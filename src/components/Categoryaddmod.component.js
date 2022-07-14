/**
 * PWA FinDeFes
 * update 07/2022
 * By Sergio Sam 
 */

import React from 'react';
import { useState, useEffect } from 'react'
import Paper from '@mui/material/Paper';
import { Button, TextField } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme, useStyles } from "./styles.js"
import CircularProgress from '@mui/material/CircularProgress';
import { useParams } from 'react-router';

import { useHistory } from "react-router-dom";

import { useFormik } from 'formik';
import * as yup from 'yup';

import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

import { v4 as uuidv4 } from 'uuid';

//Validacion del formulario
const validationSchema = yup.object({
  nombre: yup
    .string('Nombre de categoria requerido')
    .required('Nombre de categoria requerido'),
});

export default function Categoryaddmod() {
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false)

  //inicializacion de variables y validacion
  const formik = useFormik({
    initialValues: {
      nombre: '',
      nota: '',
      id: uuidv4(),
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
    history.push(process.env.PUBLIC_URL + "/category");
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

    const GetData = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const response = await UserService.getCategory(id);
          if (response) {
            formik.setValues(response);
            setIsLoading(false);
          } else {
            history.push(process.env.PUBLIC_URL + "/login");
          }
        } catch (e) {
          history.push(process.env.PUBLIC_URL + "/login");
        }
      }
    }
    GetData();

  }, []);

  return (

    <Paper>

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
            Agregar/Modificar Categoria
          </Typography>
        </Toolbar>
      </AppBar>

      <Container fixed>
        <Box sx={{ bgcolor: '#cfe8fc', height: '100vh', display: 'flex', marginTop: '20px' }} >

          <form onSubmit={formik.handleSubmit}>

            <Grid container spacing={3} style={{ minHeight: '100vh', padding: '20px' }} >

              <Grid item xs={12}>
                <TextField
                  name="nombre"
                  className={styles.inputMaterial}
                  label="Nomre de categoria"
                  autoFocus={true}
                  value={formik.values.nombre}
                  autoComplete='off'
                  onChange={formik.handleChange}
                  error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                  helperText={formik.touched.nombre && formik.errors.nombre}
                />
              </Grid>
              <Grid item xs={12}>
                <div align="center" style={{ background: '#fff159' }} >
                  <Button color="primary" type="submit">Guardar</Button>
                </div>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </Paper>
  );
}


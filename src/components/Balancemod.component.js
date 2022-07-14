/**
 * PWA FinDeFes
 * update 07/2022
 * By Sergio Sam 
 */

import React from 'react';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react'

import Paper from '@mui/material/Paper';
import { Modal, Button, TextField } from '@mui/material';
import { useTheme, useStyles } from "./styles.js"
import CircularProgress from '@mui/material/CircularProgress';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { useHistory } from "react-router-dom";

import { useFormik } from 'formik';
import * as yup from 'yup';

import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

//Validacion del formulario
const validationSchema = yup.object({
  nombre: yup
    .string('Nombre de categoria requerido')
    .required('Nombre de categoria requerido'),
  importe: yup
    .number('Ingresa numeros')
    .required('Ingresa un importe'),
});

export default function Balancemod() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true)

  //inicializacion de variables y validacion
  const formik = useFormik({
    initialValues: {
      nombre: '',
      categoria: '',
      categoriaid: '',
      fecha: '',
      importe: '',
      nota: '',
      tipo: '',
      id: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      peticionPost(values);
    },
  });

  const [currentUser, setCurrentUser] = useState(undefined);
  const [showclientboard, setShowClienteBoard] = useState(false);
  const [adminborad, setShowAdminBoard] = useState(false);

  const { id } = useParams();
  const styles = useStyles();
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  
  const [consolaSeleccionada, setConsolaSeleccionada] = useState({
    id: '',
    nombre: '',
  })

  const handleChange = e => {
    const { name, value } = e.target;
    setConsolaSeleccionada(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const addCategory = async () => {
    const response = await UserService.addModCategory(consolaSeleccionada.id, consolaSeleccionada);
    setData(data.concat(response.data))
    abrirCerrarModalInsertar()
  }

  const peticionPost = async (values) => {
    try {
      await UserService.addmodBalance(id, values);
    } catch (error) {
      console.log(error);
    }
    cerrarEditar()
  }

  const cerrarEditar = () => {
    history.push(process.env.PUBLIC_URL + "/balance");
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
      try {
        setIsLoading(true);
        const response = await UserService.getBalanceid(id);
        console.log(response)
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
    GetData();

    const GetDato = async () => {
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
    GetDato();

  }, []);

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  }

  const bodyInsertar = (
    <div className={styles.modal1}>
      <h3>Crear nueva categoria</h3>
      <TextField name="nombre" className={styles.inputMaterial} label="Categoria" onChange={handleChange} />
      <br />
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={() => addCategory()}>Crear</Button>
        <Button onClick={() => abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  )

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
            Modificar
          </Typography>
        </Toolbar>
      </AppBar>

      <Container fixed>
        <Box sx={{ bgcolor: '#cfe8fc', height: '100vh', display: 'flex', marginTop: '20px' }} >

          <form onSubmit={formik.handleSubmit}>

            <Grid container spacing={3} style={{ minHeight: '100vh', padding: '20px' }} >

              <Grid item xs={12}>
                <TextField
                  id="date"
                  type="date"
                  defaultValue="2021-08-25"
                  name="fecha"
                  label="Fecha"
                  className={classes.textField}
                  error={formik.touched.fecha && Boolean(formik.errors.fecha)}
                  helperText={formik.touched.fecha && formik.errors.fecha}
                  onChange={formik.handleChange}
                  value={formik.values.fecha}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="nombre"
                  className={styles.inputMaterial}
                  label="Concepto"
                  autoFocus={true}
                  autoComplete='off'
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                  helperText={formik.touched.nombre && formik.errors.nombre}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="importe"
                  className={styles.inputMaterial}
                  label="Importe"
                  autoComplete='off'
                  value={formik.values.importe}
                  onChange={formik.handleChange}
                  error={formik.touched.importe && Boolean(formik.errors.importe)}
                  helperText={formik.touched.importe && formik.errors.importe}
                />
              </Grid>

              <Grid item xs={6}>
                <InputLabel htmlFor="outlined-age-native-simple">Categoria
                  <AddCircleIcon onClick={() => abrirCerrarModalInsertar()} />
                </InputLabel>
                <Select
                  native
                  label="Categoria"
                  inputProps={{
                    name: 'categoriaid',
                    id: 'outlined-age-native-simple',
                  }}
                  className={styles.inputMaterial}
                  value={formik.values.categoriaid}
                  onChange={formik.handleChange}
                  error={formik.touched.categoriaid && Boolean(formik.errors.categoriaid)}
                  helperText={formik.touched.categoriaid && formik.errors.categoriaid}
                >
                  <option aria-label="None" value="" />
                  {data.map((value) => (
                    <option value={value.id} key={value.id}>
                      {value.nombre}
                    </option>
                  ))}
                </Select>
              </Grid>

              <Grid item xs={12}>
                <TextareaAutosize
                  name="nota"
                  className={styles.inputMaterial}
                  minRows={3} label="Nota"
                  placeholder="Nota"
                  value={formik.values.nota}
                  onChange={formik.handleChange}
                  error={formik.touched.nota && Boolean(formik.errors.nota)}
                  helperText={formik.touched.nota && formik.errors.nota}
                />
              </Grid>

              <Grid item xs={12}>
                <div align="center" style={{ background: '#fff159' }} >
                  <Button color="primary" type="submit">Modificar</Button>
                </div>
              </Grid>

            </Grid>

            <TextField
              name="tipo"
              type="hidden"
              value={formik.values.tipo}
              onChange={formik.handleChange}
              error={formik.touched.tipo && Boolean(formik.errors.tipo)}
              helperText={formik.touched.tipo && formik.errors.tipo}
            />

          </form>

          <Modal
            open={modalInsertar}
            onClose={abrirCerrarModalInsertar}>
            {bodyInsertar}
          </Modal>

        </Box>
      </Container>
    </Paper>
  );
}

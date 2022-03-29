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
import TextareaAutosize from '@mui/material/TextareaAutosize';

import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

import Grid from '@mui/material/Grid';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { useFormik } from 'formik';
import * as yup from 'yup';

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

const useStyles = makeStyles((theme) => ({
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

export default function Balancemod(props) {

  //  const [data, setData] = useState([
  //    { nombre: 'Mehmet' },
  //    { nombre: 'Zerya Betül' },
  //  ]);

  //inicializacion de variables y validacion
  const formik = useFormik({
    initialValues: {
      nombre: '',
      categoria: '',
      fecha: '',
      importe: '',
      nota: '',
      tipo: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      peticionPost(values);
    },
  });

  const { id } = useParams();

  const styles = useStyles();
  const classes = useStyles();

  const [datos, setDatos] = useState([]);
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [consolaSeleccionada, setConsolaSeleccionada] = useState({
      nombre: '',
  })

  const handleChange = e => {
    const { name, value } = e.target;
    setConsolaSeleccionada(prevState => ({
        ...prevState,
        [name]: value
    }))
}

const addCategoria = async () => {
  const response = await UserService.addmodCategoria(consolaSeleccionada.id, consolaSeleccionada);
  setData(data.concat(response.data))
  abrirCerrarModalInsertar()
}

const peticionPost = async (values) => {
    await UserService.addmodBalance(id, values);
    cerrarEditar()
  }

  const cerrarEditar = () => {
    props.history.push(process.env.PUBLIC_URL + "/balance");
  }

  const inicio = () => {
    props.history.push(process.env.PUBLIC_URL + "/")
  }

  useEffect(() => {
    const GetData = async () => {
      try {
        const response = await UserService.getBalanceid(id);
        if (response) {
          var dataNueva = response.data;
          dataNueva.map(consola => {
            formik.initialValues.nombre = consola.nombre;
            formik.initialValues.categoria = consola.categoria;
            formik.initialValues.fecha = consola.fecha;
            formik.initialValues.importe = consola.importe;
            formik.initialValues.nota = consola.nota;
            formik.initialValues.tipo = consola.tipo;
            //setData(consola.yasimientos);
          })
          //response.data.yacimientos.map(con => {
          //  data.nombre= con.nombre;
          //})

          setDatos(dataNueva);
        } else {
          props.history.push(process.env.PUBLIC_URL + "/login");
        }
      } catch (e) {
        //console.log(e);
        props.history.push(process.env.PUBLIC_URL + "/login");
      }
    }
    GetData();

    const GetDato = async () => {
      try {
        const result = await UserService.getCategorias();
        if (result) {
          setData(result.data);
        } else {
          props.history.push(process.env.PUBLIC_URL + "/login");
        }
      } catch (e) {
        props.history.push(process.env.PUBLIC_URL + "/login");
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
          <Button color="primary" onClick={() => addCategoria()}>Crear</Button>
          <Button onClick={() => abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
  </div>
)


  return (
    <Paper className={classes.root}>

      <Breadcrumbs aria-label="breadcrumb">
        <Button style={{ color: "#fff", backgroundColor: "#2e7d32", }} variant="contained" onClick={() => inicio()}>Inicio</Button>
      </Breadcrumbs>

      <div className={styles.modal}>
        <form onSubmit={formik.handleSubmit}>
          <h3>Modificar movimiento</h3>
          <Grid container spacing={3}>

            <Grid item xs={6}>
              <TextField
                name="nombre"
                className={styles.inputMaterial}
                label="Nombre"
                autoFocus={true}
                value={formik.values.nombre}
                onChange={formik.handleChange}
                error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                helperText={formik.touched.nombre && formik.errors.nombre}
              />
            </Grid>

            <Grid item xs={6}>
              <InputLabel htmlFor="outlined-age-native-simple">Categoria</InputLabel>
              <Select
                native
                label="Categoria"
                inputProps={{
                  name: 'categoria',
                  id: 'outlined-age-native-simple',
                }}
                value={formik.values.categoria}
                onChange={formik.handleChange}
                error={formik.touched.categoria && Boolean(formik.errors.categoria)}
                helperText={formik.touched.categoria && formik.errors.categoria}
              >
                <option aria-label="None" value="" />
                {data.map((value) => (
                  <option value={value.id} key={value.id}>
                    {value.nombre}
                  </option>
                ))}
              </Select>

              <Button style={{ color: "#fff", backgroundColor: "#2e7d32", }} variant="contained" onClick={() => abrirCerrarModalInsertar()}>Nueva Categoria</Button>

            </Grid>

            <Grid item xs={6}>
              <TextField
                required
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
                name="importe"
                className={styles.inputMaterial}
                label="Importe"
                value={formik.values.importe}
                onChange={formik.handleChange}
                error={formik.touched.importe && Boolean(formik.errors.importe)}
                helperText={formik.touched.importe && formik.errors.importe}
              />
            </Grid>

            <Grid item xs={12}>
              <TextareaAutosize
                name="nota"
                aria-label="empty textarea"
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
              <TextField
                name="tipo"
                type="hidden"
                value={formik.values.tipo}
                onChange={formik.handleChange}
                error={formik.touched.tipo && Boolean(formik.errors.tipo)}
                helperText={formik.touched.tipo && formik.errors.tipo}
              />
            </Grid>

          </Grid>

          <div align="right">
            <Button color="primary" type="submit">Modificar</Button>
            <Button color="primary" onClick={() => cerrarEditar()}>Cancelar</Button>
          </div>
        </form>

      </div>

      <Modal
        open={modalInsertar}
        onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
      </Modal>

    </Paper>
  );
}

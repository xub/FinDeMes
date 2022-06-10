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
import { Modal, Button, TextField, Card } from '@mui/material';
import TextareaAutosize from '@mui/material/TextareaAutosize';

import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

import Container from '@mui/material/Container';

import Grid from '@mui/material/Grid';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CssBaseline from '@mui/material/CssBaseline';

import { useFormik } from 'formik';
import * as yup from 'yup';

import UserService from "../services/user.service";

//Validacion del formulario
const validationSchema = yup.object({
    nombre: yup
        .string('Nombre requerido')
        .required('Nombre requerido'),
    importe: yup
        .number('Ingresa numeros')
        .required('Ingresa un importe'),
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

export default function Balanceadd(props) {
    const [open, setOpen] = useState(false);
    const [vertical, setVertical] = useState('top');
    const [horizontal, setHorizonal] = useState('center');

    const { id } = useParams();
    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [consolaSeleccionada, setConsolaSeleccionada] = useState({
        nombre: '',
    });

    const [postResult, setPostResult] = useState(null);

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setConsolaSeleccionada(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    //inicializacion de variables y validacion
    var d = new Date();
    var finaldate = d.getFullYear() + "-" + (d.getMonth() + 1).toString().padStart(2, "0") + "-" + d.getDate()

    const formik = useFormik({
        initialValues: {
            nombre: '',
            categoria: '',
            categoriaid: '',
            fecha: finaldate,
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

    const styles = useStyles();
    const classes = useStyles();

    const inicio = () => {
        props.history.push(process.env.PUBLIC_URL + "/")
    }

    const cerrarEditar = () => {
        props.history.push(process.env.PUBLIC_URL + "/balance");
    }

    useEffect(() => {
    }, []);

    const addCategory = async () => {
        const response = await UserService.addModCategory(consolaSeleccionada.id, consolaSeleccionada);
        setData(data1.concat(response.data))
        abrirCerrarModalInsertar()
    }

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

    const peticionPost = async (data) => {
        cerrarEditar()
    }


    return (
        <Paper className={classes.root}>
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
                        Nuevos {id}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Box sx={{ bgcolor: '#cfe8fc', height: '100vh', display: 'flex' }} >

                    <Grid container
                        spacing={3}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        style={{ minHeight: '100vh' }} >

                        <Grid item xs={12}>
                            <TextField
                                style={{ alignItems: 'center' }}
                                id="date"
                                type="date"
                                defaultValue="2021-08-25"
                                name="fecha"
                                label="Fecha"
                                error={formik.touched.fecha && Boolean(formik.errors.fecha)}
                                helperText={formik.touched.fecha && formik.errors.fecha}
                                onChange={formik.handleChange}
                                value={formik.values.fecha}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
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


                    </Grid>
                </Box>
            </Container>
        </Paper>
    );
}
/**
 * PWA FinDeFes
 * update 06/2022
 * By Sergio Sam 
 */

import React from 'react';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react'

import { makeStyles } from '@mui/styles';

import Paper from '@mui/material/Paper';
import { Button, TextField } from '@mui/material';

import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useFormik } from 'formik';
import * as yup from 'yup';

import UserService from "../services/user.service";

import AuthService from "../services/auth.service";
import { useOnlineStatus } from "./useOnlineStatus";

import { v4 as uuidv4 } from 'uuid';

//Validacion del formulario
const validationSchema = yup.object({
    nombre: yup
        .string('Nombre de la categoria')
        .required('Nombre de la categoria'),
});

export default function Categoriasadd(props) {
    const isOnline = useOnlineStatus();

    //inicializacion de variables y validacion
    const formik = useFormik({
        initialValues: {
            nombre: '',
            id: uuidv4(),
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            peticionPost(values);
            //alert(JSON.stringify(values, null, 2));
        },
    });

    const [currentUser, setCurrentUser] = useState(undefined);
    const [showClienteBoard, setShowClienteBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);

    const { id } = useParams();

    const peticionPost = async (data) => {
        const response = await UserService.addModCategory(id, data);
        cerrarEditar()
    }

    const cerrarEditar = () => {
        props.history.push(process.env.PUBLIC_URL + "/category");
    }

    const inicio = () => {
        props.history.push(process.env.PUBLIC_URL + "/")
    }

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


    }, []);

    const styles = useStyles();
    const classes = useStyles();

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
                        Nueva Categoria
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
                                    label="Categoria"
                                    autoFocus={true}
                                    value={formik.values.nombre}
                                    onChange={formik.handleChange}
                                    error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                                    helperText={formik.touched.nombre && formik.errors.nombre}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <div align="center" style={{ background: '#fff159' }} >
                                    <Button color="primary" type="submit">Agregar {id}</Button>
                                </div>
                            </Grid>

                        </Grid>

                    </form>
 
                </Box>
            </Container>

        </Paper>
    );
}
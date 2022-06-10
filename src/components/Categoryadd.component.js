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
import { Button, TextField } from '@mui/material';

import Grid from '@mui/material/Grid';
import Breadcrumbs from '@mui/material/Breadcrumbs';

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

    const styles = useStyles();
    const classes = useStyles();

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

    return (
        <Paper className={classes.root}>

            <Breadcrumbs aria-label="breadcrumb">
                <Button style={{ color: "#fff", backgroundColor: "#2e7d32", }} variant="contained" onClick={() => inicio()}>Inicio</Button>
            </Breadcrumbs>

            <div className={styles.modal}>
                <form onSubmit={formik.handleSubmit}>
                    <h3>Agregar Categoria</h3>
                    <Grid container spacing={3}>

                        <Grid item xs={6}>
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


                    </Grid>

                    <div align="right">
                        <Button color="primary" type="submit">Agregar</Button>
                        <Button color="primary" onClick={() => cerrarEditar()}>Cancelar</Button>
                    </div>
                </form>

            </div>
        </Paper>
    );
}
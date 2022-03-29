/**
 * PWA FinDeFes
 * update 04/2022
 * By Sergio Sam 
 */

import React from 'react';
import { useEffect } from 'react'
import { useParams } from 'react-router';

import { makeStyles} from '@mui/styles';

import Paper from '@mui/material/Paper';
import { Button, TextField } from '@mui/material';

import Grid from '@mui/material/Grid';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { useFormik } from 'formik';
import * as yup from 'yup';

import UserService from "../services/user.service";

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

    //inicializacion de variables y validacion
    const formik = useFormik({
        initialValues: {
            nombre: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            peticionPost(values);
            //alert(JSON.stringify(values, null, 2));
        },
    });

    const { id } = useParams();

    const styles = useStyles();
    const classes = useStyles();

    const peticionPost = async (data) => {
        const response = await UserService.addmodCategoria(id, data);
        cerrarEditar()
    }

    const cerrarEditar = () => {
        props.history.push(process.env.PUBLIC_URL + "/categorias");
    }

    const inicio = () => {
        props.history.push(process.env.PUBLIC_URL + "/")
    }

    useEffect(() => {
        const GetData = async () => {
            try {
                const result = await UserService.getlive();
                if (result) {
                } else {
                    props.history.push(process.env.PUBLIC_URL + "/login");
                }
            } catch (e) {
                props.history.push(process.env.PUBLIC_URL + "/login");
            }
        }
        GetData();
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
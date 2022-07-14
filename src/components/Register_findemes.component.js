/**
 * App FinDeFes
 * update 04/2022
 * By Sergio Sam 
 */

import React, { useEffect, useState, useRef } from "react";
import Form from "react-validation/build/form";

import { makeStyles} from '@mui/styles';

import CheckButton from "react-validation/build/button";

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useHistory } from "react-router-dom";

import UserService from "../services/user.service";

import * as yup from 'yup';
import { useFormik } from 'formik';
import fondo from '../loco.png';

var mailant = "";
var resmailant = false;

const checkEmail = async (values) => {
    const response = await UserService.validEmails(values,'findemes');
    return response.data;
}
const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(' + fondo + ')',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#fff',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: (8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: '1px',
        backgroundColor: '#fff',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: '1px',
    },
    submit: {
        margin: (3, 0, 2),
    },
}));

//Validacion del formulario
const validationSchema = yup.object({
    nombre: yup
        .string('Tu nombre es requerido')
        .required('Tu nombre requerido'),
    email: yup
        .string('Email requerido')
        .email('Email no valido')
        .required('Email requerido')
        .test('checkDuplUsername', 'El email ya esta en uso, utilize otro email', async function (value) {
            if (value) {
                if (value !== mailant) {
                    mailant = value;
                    const res = await checkEmail(value);
                    if (res) {
                        resmailant = false;
                        return false;
                    } else {
                        resmailant = true;
                        return true;
                    }
                } else {
                    return resmailant;
                }
            }
        }),
    password: yup.string()
        .required('Password es requerido')
        .min(6, 'Password debe tener al menos 6 caracteres')
        .max(40, 'Password no debe exeder los 40 caracteres'),
    confirmPassword: yup.string()
        .required('Confirm Password es requerido')
        .oneOf([yup.ref('password'), null], 'Confirm Password no coinciden'),
    acceptTerms: yup.bool().oneOf([true], 'Debes aceptar los terminos y condiciones'),
});

export default function Register_findemes() {
    const history = useHistory();
    const classes = useStyles();
    const checkBtn = useRef();
 
    //inicializacion de variables y validacion
    const formik = useFormik({
        initialValues: {
            nombre: '',
            email: '',
            password: '',
            empresa: 'findemes',
            producto: 'findemes',
            acceptTerms: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            peticionPost(values);
            //alert(JSON.stringify(values, null, 2));
        },
    });

    const peticionPost = async (values) => {
        await UserService.register_findemes(values.nombre, values.email, values.password, values.empresa, values.producto);
        cerrarEditar()
    }

    const [shown, setShown] = useState(false);
    const [shown1, setShown1] = useState(false);

    const switchShown = () => setShown(!shown);
    const switchShown1 = () => setShown1(!shown1);

    const cerrarEditar = () => {
        history.push("/home");
    }

    useEffect(() => {
        //setLoading(false);
    }, []);

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={6} className={classes.image} />
            <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
                <div className={classes.paper}>

                    <Typography component="h1" variant="h5">
                        Registrate
                    </Typography>

                    <Form className={classes.form} noValidate onSubmit={formik.handleSubmit} >

                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="nombre"
                            label="Nombre"
                            autoComplete="nombre"
                            autoFocus
                            name="nombre"
                            value={formik.values.nombre}
                            onChange={formik.handleChange}
                            error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                            helperText={formik.touched.nombre && formik.errors.nombre}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="email"
                            label="Direccion de email"
                            autoComplete="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />

                        <TextField
                            type={shown ? 'text' : 'password'}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            autoComplete="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />

                        <span class="input-group-btn">
                            <button class="btn btn-default" type="button" onClick={switchShown}>
                                {shown ? 'Ocultar' : 'Ver'}
                            </button>
                        </span>

                        <TextField
                            type={shown1 ? 'text' : 'password'}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="confirmPassword"
                            label="Confirm Password"
                            autoComplete="confirmPassword"
                            name="confirmPassword"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        />

                        <span class="input-group-btn">
                            <button class="btn btn-default" type="button" onClick={switchShown1}>
                                {shown1 ? 'Ocultar' : 'Ver'}
                            </button>
                        </span>

                        <input type="hidden" name="producto" class="form-control"
                            value={formik.values.producto}
                            onChange={formik.handleChange}
                            error={formik.touched.producto && Boolean(formik.errors.producto)}
                            helperText={formik.touched.producto && formik.errors.producto}
                        />

                        <div className="form-group form-check">
                            <input
                                name="acceptTerms"
                                type="checkbox"
                                className="form-check-input"
                                value={formik.values.acceptTerms}
                                onChange={formik.handleChange}
                                error={formik.touched.acceptTerms && Boolean(formik.errors.acceptTerms)}
                                helperText={formik.touched.acceptTerms && formik.errors.acceptTerms}
                            />

                            <label htmlFor="acceptTerms" className="form-check-label">
                                He leido y acepto los terminos y condiciones
                            </label>
                            <CheckButton style={{ display: "none" }} ref={checkBtn} />

                            {formik.errors.acceptTerms &&
                                <div>
                                    {formik.errors.acceptTerms}
                                </div>}
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Registrarse
                        </Button>


                    </Form>
                </div>
            </Grid>
        </Grid>

    );
}

//export default Home;

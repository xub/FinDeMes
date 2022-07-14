/**
 * PWA FinDeFes
 * update 07/2022
 * By Sergio Sam 
 */

import React from 'react';
import { useState, useEffect } from 'react';

import { Button, TextField } from '@mui/material/';
import Grid from '@mui/material/Grid';
import Excel from "./Excel.component";
import { Modal } from '@mui/material/';
import { useTheme, useStyles } from "./styles.js"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { useHistory } from "react-router-dom";

import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';

import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import CircularProgress from '@mui/material/CircularProgress';

import { useFormik } from 'formik';
import * as yup from 'yup';

import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

//Validacion del formulario
const validationSchema = yup.object({
    fechainicio: yup
        .string('Fecha requerida')
        .required('Fecha requerida'),
    fechafin: yup
        .string('Fecha requerida')
        .required('Fecha requerida'),
});

export default function Informes() {
    const history = useHistory();

    const [isLoading, setIsLoading] = useState(true)

    const [currentUser, setCurrentUser] = useState(undefined);
    const [showclientboard, setShowClienteBoard] = useState(false);
    const [adminborad, setShowAdminBoard] = useState(false);

    const [modalQR, setModalQR] = useState(false);
    const [values, setValues] = useState([]);
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const abrirCerrarModalQR = () => {
        setModalQR(!modalQR);
    }

    const peticionPost = async (data) => {
        const response = await UserService.getInforme(data);
        if (response.data == null) {
            setOpen(true);
            //setModalQR(!modalQR);
        } else {
            abrirCerrarModalQR();
            setValues(response.data);
        }
        //cerrarEditar()
    }

    //inicializacion de variables y validacion
    const formik = useFormik({
        initialValues: {
            fechainicio: '',
            fechafin: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            peticionPost(values);
            //abrirCerrarModalQR();
        },
    });

    const styles = useStyles();
    const classes = useStyles();

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

    }, []);

    const inicio = () => {
        history.push(process.env.PUBLIC_URL + "/")
    }

    const bodyQR = (
        <div className={styles.modal1}>
            <Excel url={values} />
        </div>
    )

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
                        Excel con totales por categorias
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container fixed>
                <Box sx={{ bgcolor: '#cfe8fc', height: '100vh', display: 'flex', marginTop: '20px' }} >
                    <form onSubmit={formik.handleSubmit}>
                        <h3>Totales por Categorias</h3>
                        <Grid container spacing={3} style={{ minHeight: '100vh', padding: '20px' }}>

                            <Grid item xs={6}>
                                <TextField
                                    id="date"
                                    type="date"
                                    defaultValue="2021-08-25"
                                    name="fechainicio"
                                    label="Fecha desde:"
                                    className={classes.textField}
                                    error={formik.touched.fechainicio && Boolean(formik.errors.fechainicio)}
                                    helperText={formik.touched.fechainicio && formik.errors.fechainicio}
                                    onChange={formik.handleChange}
                                    value={formik.values.fechainicio}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    id="date"
                                    type="date"
                                    defaultValue="2021-08-25"
                                    name="fechafin"
                                    label="Fecha hasta:"
                                    className={classes.textField}
                                    error={formik.touched.fechafin && Boolean(formik.errors.fechafin)}
                                    helperText={formik.touched.fechafin && formik.errors.fechafin}
                                    onChange={formik.handleChange}
                                    value={formik.values.fechafin}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <div align="center" style={{ background: '#fff159' }} >
                                    <Button color="primary" type="submit">Generar Informe </Button>
                                </div>
                            </Grid>

                        </Grid>

                    </form>
                </Box>
            </Container>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"No fue posible generar el informe"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        El informe no posee datos.
                        Intenta modificar los datos de tu consulta.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            <Modal
                open={modalQR}
                onClose={abrirCerrarModalQR}>
                {bodyQR}
            </Modal>

        </Paper>
    );
}
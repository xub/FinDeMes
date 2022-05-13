/**
 * PWA FinDeFes
 * update 04/2022
 * By Sergio Sam 
 */

import React from 'react';
import { useState, useEffect } from 'react';

import { makeStyles } from '@mui/styles';

import { Button, TextField } from '@mui/material/';
import Grid from '@mui/material/Grid';
import Excel from "./Excel.component";
import { Modal } from '@mui/material/';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';

import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';

import { useFormik } from 'formik';
import * as yup from 'yup';

import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

import { useOnlineStatus } from "./useOnlineStatus";

//Validacion del formulario
const validationSchema = yup.object();

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
    iconos: {
        cursor: 'pointer'
    },
    inputMaterial: {
        width: '100%'
    }
}));

export default function Informes(props) {


    const [currentUser, setCurrentUser] = useState(undefined);
    const [showClienteBoard, setShowClienteBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const isOnline = useOnlineStatus();

    const [datayacimientos, setDatayacimientos] = useState([]);
    const [dataequipos, setDataequipos] = useState([]);

    const [left, setLeft] = useState([]);
    const [data, setData] = useState([]);
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

    const cerrarEditar = () => {
        props.history.push("/empresas");
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

    const inicio = () => {
        props.history.push(process.env.PUBLIC_URL + "/")
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

            <div className={styles.modal}>
                <form onSubmit={formik.handleSubmit}>
                    <h3>Totales por Categorias</h3>
                    <Grid container spacing={3}>

                        <Grid item xs={6}>
                            <TextField
                                id="date"
                                type="date"
                                defaultValue="2021-08-25"
                                name="fechainicio"
                                label="Fecha/carga desde:"
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
                                label="Fecha/carga hasta:"
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
                        <Grid item xs={12} style={{ background: '#fff159' }}>
                            <div align="center">
                                <Button color="primary" type="submit">GENERAR INFORME</Button>
                            </div>
                        </Grid>

                    </Grid>

                </form>

            </div>

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
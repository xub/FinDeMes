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

import { v4 as uuidv4 } from 'uuid';

import { useFormik } from 'formik';
import * as yup from 'yup';

import AuthService from "../services/auth.service";
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

    const [currentUser, setCurrentUser] = useState(undefined);
    const [showClienteBoard, setShowClienteBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);

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
    var finaldate = d.getFullYear() + "-" + (d.getMonth() + 1).toString().padStart(2, "0") + "-" + (d.getDate()).toString().padStart(2, "0")

    const formik = useFormik({
        initialValues: {
            nombre: '',
            categoria: '',
            categoriaid: '',
            fecha: finaldate,
            importe: '',
            nota: '',
            tipo: id,
            id: uuidv4(),
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

    const peticionPost = async (data) => {
        await UserService.addmodBalance(id, data);
        cerrarEditar()
    }

    const cerrarEditar = () => {
        props.history.push(process.env.PUBLIC_URL + "/balance");
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

        const GetDato = async () => {
            try {
                const result = await UserService.getCategories();
                if (result) {
                    setData(result);
                } else {
                    props.history.push(process.env.PUBLIC_URL + "/login");
                }
            } catch (e) {
                props.history.push(process.env.PUBLIC_URL + "/login");
            }
        }
        GetDato();

    }, []);

    const addCategory = async () => {
        const response = await UserService.addmodCategory(consolaSeleccionada.id, consolaSeleccionada);
        setData(data.concat(response.data))
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
                        Nuevos {id}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container fixed>
                <Box sx={{ bgcolor: '#cfe8fc', height: '100vh', display: 'flex' }} >

                    <form onSubmit={formik.handleSubmit}>

                        <Grid container spacing={3} style={{ minHeight: '100vh' }} >

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
                                    <Button color="primary" type="submit">Agregar {id}</Button>
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

                        <TextField
                            name="id"
                            type="hidden"
                            value={formik.values.id}
                            onChange={formik.handleChange}
                            error={formik.touched.id && Boolean(formik.errors.id)}
                            helperText={formik.touched.id && formik.errors.id}
                        />

                    </form>

                    <div>
                        {postResult && (
                            <div className="alert alert-secondary mt-2" role="alert">
                                <pre>{postResult}</pre>
                            </div>
                        )}
                    </div>

                    <Modal
                        open={modalInsertar}
                        onClose={abrirCerrarModalInsertar}>
                        {bodyInsertar}
                    </Modal>

                    <Snackbar open={open} autoHideDuration={12000} onClose={handleClose} anchorOrigin={{ vertical, horizontal }}>
                        <Alert severity="warning" onClose={handleClose} sx={{ width: '100%' }}>
                            Estas sin conexion, los datos se guardaran en tu dispositivo temporalmente, cuando detectemos internet se guardaran en el servidor.
                        </Alert>

                    </Snackbar>
                </Box>
            </Container>

        </Paper>
    );
}
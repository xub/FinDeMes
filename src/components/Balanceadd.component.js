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

import Snackbar from '@mui/material/Snackbar';

import Alert from '@mui/material/Alert';

import { useFormik } from 'formik';
import * as yup from 'yup';

import UserService from "../services/user.service";

import { useOnlineStatus } from "./useOnlineStatus";

import { useMutation } from 'react-query';

//Validacion del formulario
const validationSchema = yup.object({
    nombre: yup
        .string('Nombre del gasto')
        .required('Nombre del egreso gasto'),
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
        border: '2px solid #000',
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

    const isOnline = useOnlineStatus();
    const { id } = useParams();
    const [data1, setData] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [consolaSeleccionada, setConsolaSeleccionada] = useState({
        nombre: '',
    });
    const fortmatResponse = (res) => {
        return JSON.stringify(res, null, 2);
    };
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
    const formik = useFormik({
        initialValues: {
            nombre: '',
            categoria: '',
            fecha: '',
            importe: '',
            nota: '',
            tipo: id,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            //peticionPost(values);
            postData();
            //alert(JSON.stringify(values, null, 2));
        },
    });

    const styles = useStyles();
    const classes = useStyles();

    const inicio = () => {
        props.history.push(process.env.PUBLIC_URL + "/")
    }


    const cerrarEditar = () => {
        props.history.push(process.env.PUBLIC_URL + "/home");
    }

    useEffect(() => {

        //       const GetData = async () => {
        //           try {
        //               const result = await UserService.getlive('findemes');
        //               if (result) {
        //               } else {
        //                   props.history.push(process.env.PUBLIC_URL + "/login");
        //               }
        //           } catch (e) {
        //               props.history.push(process.env.PUBLIC_URL + "/login");
        //           }
        //       }
        //       GetData();

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

    //add codigo qr
    const addCategoria = async () => {
        const response = await UserService.addmodCategoria(consolaSeleccionada.id, consolaSeleccionada);
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
                <Button color="primary" onClick={() => addCategoria()}>Crear</Button>
                <Button onClick={() => abrirCerrarModalInsertar()}>Cancelar</Button>
            </div>
        </div>
    )

    const { isLoading: isPostingTutorial, mutate: postTutorial } = useMutation(
        async () => {
            return await UserService.addmodBalance(id, formik.values);
        },
        {
            onSuccess: (res) => {
                const result = {
                    status: res.status + "-" + res.statusText,
                    headers: res.headers,
                    data: res.data,
                };
                setPostResult(fortmatResponse(result));
            },
            onError: (err) => {
                setPostResult(fortmatResponse(err.response?.data || err));
            },
        }
    );

    const peticionPost = async (data) => {
        const result = await UserService.addmodBalance(id, data);
        console.log(result);
        if (result == 'TypeError: Failed to fetch') {
            setOpen(true);
        }
        cerrarEditar()
    }

    function postData() {
        try {
            postTutorial();
        } catch (err) {
            setPostResult(fortmatResponse(err));
        }
    }

    return (
        <Paper className={classes.root}>

            <Breadcrumbs aria-label="breadcrumb">
                <Button style={{ color: "#fff", backgroundColor: "#2e7d32", }} variant="contained" onClick={() => inicio()}>Inicio</Button>
            </Breadcrumbs>

            <div className={styles.modal}>
                <form onSubmit={formik.handleSubmit}>
                    <h3>Agregar {id}</h3>
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
                                {data1.map((value) => (
                                    <option value={value.id} key={value.id}>
                                        {value.nombre}
                                    </option>
                                ))}
                            </Select>

                            <Button style={{ color: "#fff", backgroundColor: "#2e7d32", }} variant="contained" onClick={() => abrirCerrarModalInsertar()}>Nueva Categoria</Button>

                        </Grid>

                        <Grid item xs={6}>
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
                                name="importe"
                                className={styles.inputMaterial}
                                label="Importe"
                                autoComplete='off'
                                value={formik.values.codigo}
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

                    </Grid>

                    <div align="right">
                        <Button color="primary" type="submit">Agregar</Button>
                        <Button color="primary" onClick={() => cerrarEditar()}>Cancelar</Button>
                    </div>
                </form>

            </div>
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
        </Paper>
    );
}
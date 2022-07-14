/**
 * App FinDeFes
 * update 04/2022
 * By Sergio Sam 
 */

import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";

import { makeStyles} from '@mui/styles';

import CheckButton from "react-validation/build/button";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { useHistory } from "react-router-dom";

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';


import AuthService from "../services/auth.service";
import fondo from '../loco.png';

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://findemes.mine.com.ar">
        Fin de Mes
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
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

const Login = () => {
  const history = useHistory();
  const classes = useStyles();
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.login(username, password).then(
        () => {
          history.push(process.env.PUBLIC_URL + "/home");
          window.location.reload();
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
        }
      );
    } else {
      setLoading(false);
    }
  };
  
  const abrirCerrarModalInsertar = () => {
    history.push("/registrarse/")
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={6} className={classes.image} />
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
        <div className={classes.paper}>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => abrirCerrarModalInsertar()}            
         >
            Crear Nueva Cuenta
          </Button>

          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>


          <Typography component="h1" variant="h5">
            Ingresar
          </Typography>
          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
          <Form className={classes.form} noValidate onSubmit={handleLogin} ref={form}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Direccion de email"
              autoComplete="email"
              autoFocus
              name="_username"
              value={username}
              onChange={onChangeUsername}
              validations={[required]}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Clave"
              type="password"
              id="password"
              autoComplete="current-password"
              className="form-control"
              name="_password"
              value={password}
              onChange={onChangePassword}
              validations={[required]}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Recordar"
            />
            <CheckButton style={{ display: "none" }} ref={checkBtn} />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Ingresar
            </Button>

            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </Form>
        </div>
      </Grid>
    </Grid>
  );
};
export default Login;


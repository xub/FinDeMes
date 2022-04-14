/**
 * PWA FinDeFes
 * update 04/2022
 * By Sergio Sam 
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { mdiBookMultipleOutline, mdiPlusCircle, mdiMinusCircle, mdiChartBar, mdiFormatListBulleted, mdiSortVariant } from '@mdi/js'
import Icon from '@mdi/react';

import { makeStyles } from '@mui/styles';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

import { useOnlineStatus } from "./useOnlineStatus";
import { useQuery, useQueryClient } from "react-query";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
  iconos: {
    cursor: 'pointer'
  },
  inputMaterial: {
    width: '100%'
  },

  paper: {
    padding: '1px',
    margin: 'auto',
    maxWidth: 500,
    borderRadius: 2,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },

}));

const Home = (props) => {
  const isOnline = useOnlineStatus();

  const [total, setTotal] = useState([]);
  const [showClienteBoard, setShowClienteBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setShowClienteBoard(user.roles.includes("ROLE_USER"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    const GetLive = async () => {
      try {
        const result = await UserService.getlive('findemes');
        if (result.code !== 401) {
        } else {
          props.history.push(process.env.PUBLIC_URL + "/login");
        }
      } catch (e) {
        props.history.push(process.env.PUBLIC_URL + "/login");
      }
    }
    GetLive();

  }, []);

  const categoriasQuery = useQuery('categorias', () => UserService.getCategorias(),
    {
      staleTime: Infinity
    });

  const balanceQuery = useQuery('balance', () => UserService.getBalance(),
    {
      staleTime: Infinity
    });

  const queryClient = useQueryClient();
  const {
    data: posts,
    error,
    isLoading,
    isFetching,
    isIdle,
    refetch,
  } = useQuery(["total"], () => UserService.getTotal(),
    {
      staleTime: Infinity
    });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );

  }

  if (error) {
    return (
      <section className="alert alert-danger">
        Error fetching posts: {error.message}
      </section>
    );
  }

  return (

    <>
      {posts && (
        <Alert variant="filled" severity="success">
          Dinero restante: $ {posts.total}
        </Alert>
      )}
      <sections>

        {showClienteBoard && (
          <items>
            <Paper className={classes.paper}>
              <Grid item xs>
                <Grid item xs container direction="column" spacing={2}>
                  <Typography gutterBottom variant="subtitle1">
                    <Link to={`${process.env.PUBLIC_URL}/balanceadd/ingresos`} className="nav-link">
                      <Icon path={mdiPlusCircle}
                        title="Ingresos"
                        size={3}
                        horizontal
                        vertical
                        rotate={180}
                        color="#2e7d32"
                      />
                    </Link>
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Ingresos
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </items>
        )}

        {showClienteBoard && (
          <items>
            <Paper className={classes.paper}>
              <Grid item xs>
                <Grid item xs container direction="column" spacing={2}>
                  <Typography gutterBottom variant="subtitle1">
                    <Link to={`${process.env.PUBLIC_URL}/balanceadd/gastos`} className="nav-link">
                      <Icon path={mdiMinusCircle}
                        title="Gastos"
                        size={3}
                        horizontal
                        vertical
                        rotate={180}
                        color="#e74c3c"
                      />
                    </Link>
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Gastos
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </items>
        )}

        {showClienteBoard && (
          <items>
            <Paper className={classes.paper}>
              <Grid item xs>
                <Grid item xs container direction="column" spacing={2}>
                  <Typography gutterBottom variant="subtitle1">
                    <Link to={`${process.env.PUBLIC_URL}/balance`} className="nav-link">
                      <Icon path={mdiSortVariant}
                        title="Balance"
                        size={3}
                        horizontal
                        vertical
                        rotate={180}
                        color="#2e7d32"
                      />
                    </Link>
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Balance
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </items>
        )}

        {showClienteBoard && (
          <items>
            <Paper className={classes.paper}>
              <Grid item xs>
                <Grid item xs container direction="column" spacing={2}>
                  <Typography gutterBottom variant="subtitle1">
                    <Link to={`${process.env.PUBLIC_URL}/categorias`} className="nav-link">
                      <Icon path={mdiBookMultipleOutline}
                        title="Categorias"
                        size={3}
                        horizontal
                        vertical
                        rotate={180}
                        color="#2e7d32"
                      />
                    </Link>
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Categorias
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </items>
        )}

        {showClienteBoard && (
          <items>
            <Paper className={classes.paper}>
              <Grid item xs>
                <Grid item xs container direction="column" spacing={2}>
                  <Typography gutterBottom variant="subtitle1">
                    <Link to={`${process.env.PUBLIC_URL}/informes`} className="nav-link">
                      <Icon path={mdiFormatListBulleted}
                        title="Informes"
                        size={3}
                        horizontal
                        vertical
                        rotate={180}
                        color="#2e7d32"
                      />
                    </Link>
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Informes
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </items>
        )}

        {showClienteBoard && (
          <items>
            <Paper className={classes.paper}>
              <Grid item xs>
                <Grid item xs container direction="column" spacing={2}>
                  <Typography gutterBottom variant="subtitle1">
                    <Link to={`${process.env.PUBLIC_URL}/graficos`} className="nav-link">
                      <Icon path={mdiChartBar}
                        title="Graficos"
                        size={3}
                        horizontal
                        vertical
                        rotate={180}
                        color="#2e7d32"
                      />
                    </Link>
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Graficos
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </items>
        )}

      </sections>

    </>

  );
};

export default Home;

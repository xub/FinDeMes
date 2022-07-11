/**
 * PWA FinDeFes
 * update 07/2022
 * By Sergio Sam 
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { mdiBookMultipleOutline, mdiPlusCircle, mdiMinusCircle, mdiChartBar, mdiFormatListBulleted, mdiSortVariant } from '@mdi/js'
import Icon from '@mdi/react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import HomeIcon from '@mui/icons-material/Home';
import { messages as allMessages } from '../messages';

import { useOnlineStatus, OnlineStatusProvider } from "./useOnlineStatus";
import Online from "./Online.component";
import { IntlProvider } from 'react-intl';
import clsx from 'clsx';
import { useHistory } from "react-router-dom";

import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { ServiceWorkerUpdateListener } from '../ServiceWorkerUpdateListener.js'
import logo from '../logo1.svg';

import { openDB } from 'idb';
import idbcache from 'idbcache';

import { useStyles } from "./styles.js"

//Create to Database
const createIndexedDB = () => {
  //if (!('indexedDB' in window)) { return null; }
  openDB('findemes', 1, {
    upgrade(db) {
      db.createObjectStore('balance', { keyPath: 'id', autoIncrement: true });
      db.createObjectStore('categorias', { keyPath: 'id', autoIncrement: true });
      db.createObjectStore('total', { keyPath: 'id', autoIncrement: true });
      db.createObjectStore('offlineAdd', { keyPath: 'id', autoIncrement: true });
      db.createObjectStore('offlineDel', { keyPath: 'id', autoIncrement: true });
      db.createObjectStore('status', { keyPath: 'id', autoIncrement: true });
      idbcache.set('hello', 'world', 2);
    },
  });
}

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)

  const isOnline = useOnlineStatus();

  const history = useHistory();

  const [currentUser, setCurrentUser] = useState(undefined);
  const [showClienteBoard, setShowClienteBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);

  const [updateWaiting, setUpdateWaiting] = useState(false);
  const [registration, setRegistration] = useState(null);

  const currentLocale = 'es';
  const messages = allMessages[currentLocale];

  const [total, setTotal] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [swListener, setSwListener] = useState({});
  const [value, setValue] = React.useState(0);
  const ref = React.useRef(null);

  const classes = useStyles();

  useEffect(() => {

    // TODO - create indexedDB database
    try {
      const dbPromise = createIndexedDB();
    } catch (e) {
      console.log(e);
    }

    // AGREGAR ESTE IF EN TODOS LOS useEffect 

    // si no hay user hay que loguearse 
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setShowClienteBoard(user.roles.includes("ROLE_USER"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    } else {
      history.push(process.env.PUBLIC_URL + "/login");
    }

    const GetBalance = async () => {
      try {
        setIsLoading(true);
        const result = await UserService.getBalance();
        if (result) {
          setIsLoading(false);
        } else {
          history.push(process.env.PUBLIC_URL + "/login");
        }
      } catch (e) {
        history.push(process.env.PUBLIC_URL + "/login");
      }
    }
    GetBalance();

    const GetCategories = async () => {
      try {
        setIsLoading(true);
        const result = await UserService.getCategories();
        if (result) {
          setIsLoading(false);
        } else {
          history.push(process.env.PUBLIC_URL + "/login");
        }
      } catch (e) {
        history.push(process.env.PUBLIC_URL + "/login");
      }
    }
    GetCategories();

    const GetTotal = async () => {
      try {
        setIsLoading(true);
        const result = await UserService.getTotal();
        if (result.total) {
          setTotal(result.total);
          setIsLoading(false);
        } else {
          setTotal('0');
        }
      } catch (e) {
        history.push(process.env.PUBLIC_URL + "/login");
      }
    }
    GetTotal();

    if (process.env.NODE_ENV !== "development") {
      let listener = new ServiceWorkerUpdateListener();
      setSwListener(listener);
      listener.onupdateinstalling = (installingEvent) => {
        console.log("SW installed", installingEvent);
      };
      listener.onupdatewaiting = (waitingEvent) => {
        console.log("New update waiting", waitingEvent);
        setUpdateWaiting(true);
      };
      listener.onupdateready = (event) => {
        console.log("Updateready event");
        window.location.reload();
      };
      navigator.serviceWorker.getRegistration().then((reg) => {
        listener.addRegistration(reg);
        setRegistration(reg);
      });

      return () => listener.removeEventListener(null, null);
    } else {
      //do nothing because no sw in development
    }

  }, []);

  const handleUpdate = () => {
    swListener.skipWaiting(registration.waiting);
  }

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const opena = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    AuthService.logout();
    history.push(process.env.PUBLIC_URL + '/login');
    setAnchorEl(null);
  };

  const inicio = () => {
    history.push(process.env.PUBLIC_URL + "/")
  }

  const ingresos = () => {
    history.push(process.env.PUBLIC_URL + "/balanceadd/ingresos")
  }

  const gastos = () => {
    history.push(process.env.PUBLIC_URL + "/balanceadd/gastos")
  }

  return (
    <OnlineStatusProvider>
      <IntlProvider locale={currentLocale} messages={messages}>
        <header className={classes.root}>
          <CssBaseline />

          <AppBar style={{ background: '#fff159' }} position="static"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
          >
            <Toolbar>
            {isLoading && <CircularProgress color="secondary" />}
              <IconButton
                onClick={handleDrawerOpen}
              >
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                <Link to={`${process.env.PUBLIC_URL}/`} className="nav-link">
                  <div className={classes.logo}>
                    <img src={logo} alt="Fin de Mes"></img>
                  </div>
                </Link>
              </Typography>
              {currentUser ? (
                <div>
                  <IconButton
                    onClick={handleMenu}
                  >
                    <Online />
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={opena}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleProfile}>
                      {currentUser.username}
                    </MenuItem>
                    <MenuItem onClick={handleLogOut}>Salir</MenuItem>
                  </Menu>
                </div>
              ) : (
                <div className="navbar-nav ml-auto">
                  <li className="nav-item">
                  </li>
                  <li className="nav-item">
                  </li>
                </div>
              )}
            </Toolbar>
          </AppBar>

          <UpdateWaiting updateWaiting={updateWaiting} handleUpdate={handleUpdate} />

          <br></br>

          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div>
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>

          </Drawer>
        </header>
        <main>

          {total == null ? (
            <Paper className={classes.paper}>
              <Grid item xs>
                <Alert variant="outline" severity="success">
                  Dinero restante: $ {total}
                </Alert>
              </Grid>
            </Paper>
          ) :
            (
              <Paper className={classes.paper}>
                <Grid item xs>
                  <Alert variant="outline" severity="success">
                    Dinero restante: $ {total}
                  </Alert>
                </Grid>
              </Paper>
            )
          }
          <br></br>

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
                        <Link to={`${process.env.PUBLIC_URL}/category`} className="nav-link">
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

        </main>

        <footer>
          <Box sx={{ pb: 7 }} ref={ref}>
            <CssBaseline />
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
              <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              >
                <BottomNavigationAction label="Inicio" icon={<HomeIcon />} onClick={() => inicio()} />
                <BottomNavigationAction label="Ingresos" icon={<PlaylistAddIcon />} onClick={() => ingresos()} />
                <BottomNavigationAction label="Gastos" icon={<PlaylistAddCheckIcon />} onClick={() => gastos()} />
              </BottomNavigation>
            </Paper>
          </Box>
        </footer>

      </IntlProvider>

    </OnlineStatusProvider>

  );
};

export default Home;

const UpdateWaiting = ({ updateWaiting, handleUpdate }) => {
  if (!updateWaiting) return <></>
  return (
    <Alert variant="filled" severity="error" onClick={handleUpdate}>
      Versión nueva disponible, Pulsa aquí para Actualizar!
    </Alert>
  )
}
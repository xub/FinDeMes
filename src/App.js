/**
 * PWA FinDeFes
 * update 04/2022
 * By Sergio Sam 
 */

import React, { useState, useEffect } from "react";
import clsx from 'clsx';
import { Switch, Route, Link } from "react-router-dom";

import { makeStyles, useTheme } from '@mui/styles';

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

import Alert from '@mui/material/Alert';

import AuthService from "./services/auth.service";
import Login from "./components/Login";
import Register from "./components/Register_findemes.component";
import Home from "./components/Home.component";

import Balance from "./components/Balance.component";
import Balanceadd from "./components/Balanceadd.component";
import Balancemod from "./components/Balancemod.component";

import Categorias from "./components/Categorias.component";
import Categoriasadd from "./components/Categoriasadd.component";
import Categoriasmod from "./components/Categoriasmod.component";

import Informes from "./components/Informes.component";

import Profile from "./components/Profile";
import Graficos from "./components/Graficos.component";

import { IntlProvider } from 'react-intl';
import { messages as allMessages } from './messages';
import { useHistory } from "react-router-dom";
import { ServiceWorkerUpdateListener } from './ServiceWorkerUpdateListener.js'

import logo from './logo1.svg';

import './styles.css';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import HomeIcon from '@mui/icons-material/Home';

import { OnlineStatusProvider } from "./components/useOnlineStatus";
import Online from "./components/Online.component";

const useStyles = makeStyles((theme) => ({
  pie: {
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: '2px',
  },
  title: {
    flexGrow: 1,
  },
  logo: {
    maxWidth: 900,
  },
  modal: {
    position: 'absolute',
    width: 400,
    border: '2px solid #000',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },

}));

const App = (props) => {

  const history = useHistory();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const ref = React.useRef(null);

  const [updateWaiting, setUpdateWaiting] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [total, setTotal] = useState(null);
  const [swListener, setSwListener] = useState({});

  useEffect(async () => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }

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

      return () => listener.removeEventListener();
    } else {
      //do nothing because no sw in development
    }
  }, [])

  const handleUpdate = () => {
    swListener.skipWaiting(registration.waiting);
  }

  // const currentLocale = 'en-US';
  const currentLocale = 'es';
  //const currentLocale = 'de-DE';
  const messages = allMessages[currentLocale];

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

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

          <AppBar style={{ background: '#fff' }} position="static"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
          >
            <Toolbar>
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
          <Switch>
            <Route exact path={`${process.env.PUBLIC_URL}/`} component={Home} />
            <Route exact path={`${process.env.PUBLIC_URL}/home`} component={Home} />
            <Route exact path={`${process.env.PUBLIC_URL}/balance`} component={Balance} />
            <Route exact path={`${process.env.PUBLIC_URL}/balanceadd/:id`} component={Balanceadd} />
            <Route exact path={`${process.env.PUBLIC_URL}/balancemod/:id`} component={Balancemod} />
            <Route exact path={`${process.env.PUBLIC_URL}/categorias`} component={Categorias} />
            <Route exact path={`${process.env.PUBLIC_URL}/categoriasadd`} component={Categoriasadd} />
            <Route exact path={`${process.env.PUBLIC_URL}/categoriasmod/:id`} component={Categoriasmod} />
            <Route exact path={`${process.env.PUBLIC_URL}/login`} component={Login} />
            <Route exact path={`${process.env.PUBLIC_URL}/registrarse`} component={Register} />
            <Route exact path={`${process.env.PUBLIC_URL}/graficos`} component={Graficos} />
            <Route exact path={`${process.env.PUBLIC_URL}/profile`} component={Profile} />
            <Route exact path={`${process.env.PUBLIC_URL}/informes`} component={Informes} />
            <Route path={`${process.env.PUBLIC_URL}/home`} component={Home} />
          </Switch>
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
}

export default App;

const UpdateWaiting = ({ updateWaiting, handleUpdate }) => {
  if (!updateWaiting) return <></>
  return (
    <Alert variant="filled" severity="error" onClick={handleUpdate}>
      Versión nueva disponible, Pulsa aquí para Actualizar!
    </Alert>
  )
}
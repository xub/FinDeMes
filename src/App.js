/**
 * PWA FinDeFes
 * update 04/2022
 * By Sergio Sam 
 */

import React, { useState, useEffect } from "react";
import { Switch, Route, Link } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register_findemes.component";
import Home from "./components/Home.component";

import Prueba from "./components/Prueba.component";

import Balance from "./components/Balance.component";
import Balanceadd from "./components/Balanceadd.component";
import Balancemod from "./components/Balancemod.component";

import Category from "./components/Category.component";
import Categoryadd from "./components/Categoryadd.component";
import Categorymod from "./components/Categorymod.component";

import Informes from "./components/Informes.component";

import Profile from "./components/Profile";
import Graficos from "./components/Graficos.component";
import { openDB, deleteDB, wrap, unwrap } from 'idb';

import UserService from "./services/user.service";

import './styles.css';

const App = (props) => {

  useEffect(async () => {
  }, []);

  return (
    <Switch>
      <Route exact path={`${process.env.PUBLIC_URL}/`} component={Home} />
      <Route exact path={`${process.env.PUBLIC_URL}/prueba`} component={Prueba} />
      <Route exact path={`${process.env.PUBLIC_URL}/home`} component={Home} />
      <Route exact path={`${process.env.PUBLIC_URL}/balance`} component={Balance} />
      <Route exact path={`${process.env.PUBLIC_URL}/balanceadd/:id`} component={Balanceadd} />
      <Route exact path={`${process.env.PUBLIC_URL}/balancemod/:id`} component={Balancemod} />
      <Route exact path={`${process.env.PUBLIC_URL}/category`} component={Category} />
      <Route exact path={`${process.env.PUBLIC_URL}/categoryadd`} component={Categoryadd} />
      <Route exact path={`${process.env.PUBLIC_URL}/categorymod/:id`} component={Categorymod} />
      <Route exact path={`${process.env.PUBLIC_URL}/login`} component={Login} />
      <Route exact path={`${process.env.PUBLIC_URL}/registrarse`} component={Register} />
      <Route exact path={`${process.env.PUBLIC_URL}/graficos`} component={Graficos} />
      <Route exact path={`${process.env.PUBLIC_URL}/profile`} component={Profile} />
      <Route exact path={`${process.env.PUBLIC_URL}/informes`} component={Informes} />
      <Route path={`${process.env.PUBLIC_URL}/home`} component={Home} />
    </Switch>
  );
}

//procesamos offlineAdd y offlineDel
const updateAdd = async ()  => {
  const db = await openDB('findemes', 1);
  var store;

  //offlineAdd
  try {
    const store = await db.getAll('offlineAdd');
    store.map(function (bal) {
      UserService.saveOffline(bal.id, bal);
    });
  }
  catch (e) {
    console.log('error');
  }

  //offlineDel
  try {
    const store = await db.getAll('offlineDel');
    store.map(function (bal) {
      UserService.delOffline(bal.id, bal);
    });
  }
  catch (e) {
    console.log('error');
  }

}

window.addEventListener('offline', () => {
});

//Cuando detectamos que vuelve a online hacemos update de los registros
//guardados en indexdb offlineAdd y offlineDel
window.addEventListener('online', () => {
  updateAdd();
});

export default App;


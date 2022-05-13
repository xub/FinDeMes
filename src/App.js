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

import Categorias from "./components/Categorias.component";
import Categoriasadd from "./components/Categoriasadd.component";
import Categoriasmod from "./components/Categoriasmod.component";

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
  );
}

const update = async ()  => {
console.log('entra');
  // Set a value in a store:
  const db = await openDB('findemes', 1);

  var store;
  try {
    const store = await db.getAll('offline');
    console.log(store);
    store.map(function (bal) {
      //db.put('balance', bal);
      UserService.saveOffline(bal.id, bal);
      console.log(bal);
    });
  }
  catch (e) {
    console.log('error');
  }


}

window.addEventListener('offline', () => {
  // Update your UI to reflect that there's no connection.
  console.log('offline');
});

window.addEventListener('online', () => {

  // Update your UI to reflect that the connection is back.
  console.log('online');
  update();
});

export default App;


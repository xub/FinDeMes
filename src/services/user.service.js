import authHeader from "./auth-header";
import { handleResponse } from './handle-response';
import { openDB, deleteDB, wrap, unwrap } from 'idb';
import { mdiStoreRemove } from "@mdi/js";
import idbcache from 'idbcache';

//const API_URL = "http://localhost:8080/api/test/";
const API_URL = 'https://devapi.findemes.ar/api/v1/';
const user = JSON.parse(localStorage.getItem('user'));

//registramos al nuevo usuario y empresa de fin de mes
const register_findemes = (_username, _email, _password, _empresa, _producto) => {
  const data = new FormData();
  data.append('_username', _username);
  data.append('_email', _email);
  data.append('_password', _password);
  data.append('_empresa', _empresa);
  data.append('_producto', _producto);

  const requestOptions = { method: 'POST', body: data, headers: authHeader() };
  return (fetch(API_URL + 'register_findemes', requestOptions).then(handleResponse));
};

//trae estado de vida
const getlive = (producto) => {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return (fetch(API_URL + 'getlivedev?email=' + user.email + '&producto=' + producto, requestOptions).then(handleResponse));
};

//validar emails
const validEmails = (email, producto) => {
  const data = new FormData();
  data.append('email', email);
  data.append('producto', producto);

  const requestOptions = { method: 'POST', body: data, headers: authHeader() };
  return (fetch(API_URL + 'validEmail', requestOptions).then(handleResponse));
};

//trae datos pora el informe
const getInforme = (row) => {
  const data = new FormData();
  data.append('email', user.email);
  data.append('row', JSON.stringify(row));

  const requestOptions = { method: 'POST', body: data, headers: authHeader() };
  return (fetch(API_URL + 'getinforme', requestOptions).then(handleResponse));
};

//agreda a balance 
const addmodBalance = async (id, row) => {
  const data = new FormData();
  data.append('email', user.email);
  data.append('id', id);
  data.append('row', JSON.stringify(row));

  // Set a value in a store:
  const db = await openDB('findemes', 1);
  await db.put('balance', row);
  db.close();

  const requestOptions = { method: 'POST', body: data, headers: authHeader() };

  return (fetch(API_URL + 'addmodbalance', requestOptions).then(res => {
    if (res.ok) {
      console.log('ok');
      //res.text().then(text => {
      //  const data = text && JSON.parse(text);
      //  db.put('balance', data.data);
      //  db.close();
      //});

      return res;
    }
  }).then((res) => {
    console.log('ok2');
    return res;
    // Do something with the response
  }).catch((error) => {
    addOffline(id,row);
    console.log('error');
    return error
  }));

};  

const addOffline = async (id, row) => {
  // Set a value in a store:
  const db = await openDB('findemes', 1);
  await db.put('offline', row);
  db.close();
}

const delOffline = async (id) => {
  // Set a value in a store:
  const db = await openDB('findemes', 1);
  await db.delete('offline', id);
  db.close();
}

const saveOffline = async (id, row) => {
  const data = new FormData();
  data.append('email', user.email);
  data.append('id', id);
  data.append('row', JSON.stringify(row));

  const requestOptions = { method: 'POST', body: data, headers: authHeader() };

  return (fetch(API_URL + 'addmodbalance', requestOptions).then(res => {
    if (res.ok) {
      console.log('ok');

      delOffline(id);
    
      return res;
    }
  }).then((res) => {
    console.log('ok2');
    return res;
    // Do something with the response
  }).catch((error) => {
    console.log('error');
    return error
  }));
}

//Trae el total del balance
const getTotal = async (id, row) => {

  const db = await openDB('findemes', 1);
  const store = await db.getAll('total');

  if (store.length == 0) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    const data = await (fetch(API_URL + 'gettotal?email=' + user.email + '&id=' + id, requestOptions).then(handleResponse));
    const db = await openDB('findemes', 1);
    //data.map(function (bal) {
    db.put('total', data);
    //});
    db.close();

    return data;
  } else {
    return store;
  }

};

//Genera la tabla del balance
//Si la tabla de indexdb esta vacia, busca datos en red y la llena 
const getBalance = async (id, row) => {

  const db = await openDB('findemes', 1);
  const store = await db.getAll('balance');
  let update = false;

  await idbcache.get('hello').then(val => {
    if (!val) {
      idbcache.remove('hello');
      idbcache.set('hello', 'world', 2);
      update = true;
    }
  });

  if (store.length == 0 || update) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    const data = await (fetch(API_URL + 'getbalance?email=' + user.email + '&id=' + id, requestOptions).then(handleResponse));

    const db = await openDB('findemes', 1);
    data.map(function (bal) {
      db.put('balance', bal);
    });
    db.close();

    return data;
  } else {
    return store;
  }

};

//trae el total del balance
const getBalanceid = async (id, row) => {

  const db = await openDB('findemes', 1);

  var store;
  try {
    const store = db.transaction('balance').objectStore('balance');
    const value = await store.get(id);
    return value;
  }
  catch (e) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return (fetch(API_URL + 'getbalanceid?email=' + user.email + '&id=' + id, requestOptions).then(handleResponse));
  }

};

//elimina una movimiento
const delMovimiento = async (id) => {
  const data = new FormData();
  data.append('email', user.email);
  data.append('id', id);

  // Set a value in a store:
  const db = await openDB('findemes', 1);

  await db.delete('balance', id);
  db.close();

  const requestOptions = { method: 'POST', body: data, headers: authHeader() };
  return (fetch(API_URL + 'delmovimiento', requestOptions).then(handleResponse));
};

//trae el total del balance
const getCategoria = (id, row) => {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return (fetch(API_URL + 'getcategoria?email=' + user.email + '&id=' + id, requestOptions).then(handleResponse));
};

//trae el total del balance
const getCategorias = async (id, row) => {

  const db = await openDB('findemes', 1);
  const store = await db.getAll('categorias');
  let update = false;

  await idbcache.get('hello').then(val => {
    if (!val) {
      idbcache.remove('hello');
      idbcache.set('hello', 'world', 2);
      update = true;
    }
  });

  if (store.length == 0 || update) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    const data = await (fetch(API_URL + 'getcategorias?email=' + user.email + '&id=' + id, requestOptions).then(handleResponse));

    const db = await openDB('findemes', 1);
    data.map(function (bal) {
      db.put('categorias', bal);
    });
    db.close();

    return data;
  } else {
    return store;
  }

};

//agreda a balance
const addmodCategoria = (id, row) => {
  const data = new FormData();
  data.append('email', user.email);
  data.append('id', id);
  data.append('row', JSON.stringify(row));

  const requestOptions = { method: 'POST', body: data, headers: authHeader() };
  return (fetch(API_URL + 'addmodcategorias', requestOptions).then(handleResponse));
};

//elimina una movimiento
const delCategoria = (id) => {
  const data = new FormData();
  data.append('email', user.email);
  data.append('id', id);

  const requestOptions = { method: 'POST', body: data, headers: authHeader() };
  return (fetch(API_URL + 'delcategoria', requestOptions).then(handleResponse));
};

//trae el total del balance
const getGrafico = (id, row) => {
  const data = new FormData();
  data.append('email', user.email);
  data.append('id', id);

  const requestOptions = { method: 'POST', body: data, headers: authHeader() };
  return (fetch(API_URL + 'getgrafico', requestOptions).then(handleResponse));
};

export default {

  register_findemes,
  getTotal,
  getBalance,
  getBalanceid,
  addmodBalance,
  delMovimiento,
  saveOffline,

  getCategoria,
  getCategorias,
  addmodCategoria,
  delCategoria,

  getGrafico,

  getlive,
  validEmails,
  getInforme,

};

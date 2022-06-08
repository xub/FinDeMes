/**
 * PWA FinDeFes
 * update 04/2022
 * By Sergio Sam 
 */

import authHeader from "./auth-header";
import { handleResponse } from './handle-response';
import { openDB, deleteDB, wrap, unwrap } from 'idb';
import idbcache from 'idbcache';

const API_URL = 'https://devapi.findemes.ar/api/v1/';
const user = JSON.parse(localStorage.getItem('user'));

/**
 * Register a new user 
 * @param {*} _username 
 * @param {*} _email 
 * @param {*} _password 
 * @param {*} _empresa 
 * @param {*} _producto 
 * @returns 
 */
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

/**
 * Valid emails, not duplicated 
 * @param {*} email 
 * @param {*} producto 
 * @returns 
 */
const validEmails = (email, producto) => {
  const data = new FormData();
  data.append('email', email);
  data.append('producto', producto);

  const requestOptions = { method: 'POST', body: data, headers: authHeader() };
  return (fetch(API_URL + 'validEmail', requestOptions).then(handleResponse));
};

/**
 * Get data from balance 
 * @param {*} row 
 * @returns 
 */
const getInforme = (row) => {
  const data = new FormData();
  data.append('email', user.email);
  data.append('row', JSON.stringify(row));

  const requestOptions = { method: 'POST', body: data, headers: authHeader() };
  return (fetch(API_URL + 'getinforme', requestOptions).then(handleResponse));
};

/**
 * Get data to graph 
 * @param {*} id 
 * @param {*} row 
 * @returns 
 */
const getGrafico = (id, row) => {
  const data = new FormData();
  data.append('email', user.email);
  data.append('id', id);

  const requestOptions = { method: 'POST', body: data, headers: authHeader() };
  return (fetch(API_URL + 'getgrafico', requestOptions).then(handleResponse));
};

///////////////////////////////////
//MODULE BALANCe
///////////////////////////////////
/**
 * Add and Mod to balance  
 * @param {*} id 
 * @param {*} row 
 * @returns 
 */
const addmodBalance = async (id, row) => {
  const data = new FormData();
  data.append('email', user.email);
  data.append('id', id);
  data.append('row', JSON.stringify(row));

  //guardamos el importe en - si es gastos en indexdb
  if (row.tipo == 'gastos') {
    row.importe = -row.importe;
  }

  const db = await openDB('findemes', 1);

  //Agregamos registor a indexDB
  //Buscamos el nombre de la categoria
  let cat = db.transaction('categorias').objectStore('categorias');
  let catname = await cat.get(row.categoriaid);
  row.categoria = catname.nombre;
  await db.put('balance', row);

  //traemos el total guardado en indexdb
  let store = await db.getAll('total');
  let total = parseFloat(store[0].total) + parseFloat(row.importe);
  let tot = { id: '0', total };
  db.put('total', tot);

  db.close();

  const requestOptions = { method: 'POST', body: data, headers: authHeader() };

  return (fetch(API_URL + 'addmodbalance', requestOptions).then(res => {
    if (res.ok) {
      return res;
    }
  }).then((res) => {
    return res;
  }).catch((error) => {
    addOfflineAdd(id, row);
    return error
  }));

};

/**
 * Function aux for add register to indexDB in offline mode
 * @param {*} id 
 * @param {*} row 
 */
const addOfflineAdd = async (id, row) => {

  //guardamos el importe en - si es gastos en indexdb
  if (row.tipo == 'gastos') {
    row.importe = -row.importe;
  }

  const db = await openDB('findemes', 1);
  await db.put('offlineAdd', row);
  db.close();
}

/**
 * Send data to server in offline mode in indexDB
 * @param {*} id 
 * @param {*} row 
 * @returns 
 */
const saveOffline = async (id, row) => {
  const data = new FormData();
  data.append('email', user.email);
  data.append('id', id);
  data.append('row', JSON.stringify(row));

  const requestOptions = { method: 'POST', body: data, headers: authHeader() };

  return (fetch(API_URL + 'addmodbalance', requestOptions).then(res => {
    if (res.ok) {
      delOfflineIndexDb(id);
      return res;
    }
  }).then((res) => {
    return res;
  }).catch((error) => {
    return error
  }));
}

/**
 * Function aux for delete register to indexDB in offline mode
 * @param {*} id 
 */
const delOfflineIndexDb = async (id) => {
  // Set a value in a store:
  const db = await openDB('findemes', 1);
  await db.delete('offlineAdd', id);
  db.close();
}

/**
 * Get total balance
 * @param {*} id 
 * @param {*} row 
 * @returns 
 */
const getTotal = async (id, row) => {
  const db = await openDB('findemes', 1);
  const store = await db.getAll('total');

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
    const data = await (fetch(API_URL + 'gettotal?email=' + user.email + '&id=' + id, requestOptions).then(handleResponse));

    const db = await openDB('findemes', 1);
    db.put('total', data);
    db.close();
    return data;
  } else {
    return store[0];
  }

};

/**
 * Generate table balance
 * If the table of indexdb is empty, it searches data in red and fills it
 * @param {*} id 
 * @param {*} row 
 * @returns 
 */ 
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

/**
 * Get total balance
 * @param {*} id 
 * @param {*} row 
 * @returns 
 */
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

/**
 * Delete register
 * @param {*} id 
 * @returns 
 */
const delMovimiento = async (id) => {
  const data = new FormData();
  data.append('email', user.email);
  data.append('id', id);

  //Buscamos el registro en indexdb para restar al total de indexdb 
  const db = await openDB('findemes', 1);
  const store = db.transaction('balance').objectStore('balance');
  const row = await store.get(id);

  //traemos el total guardado en indexdb
  let store1 = await db.getAll('total');
  let importe = parseFloat(row.importe) * -1;
  let total = parseFloat(store1[0].total) + importe;
  let tot = { id: '0', total };
  db.put('total', tot);

  // Set a value in a store:
  await db.delete('balance', id);

  db.close();

  const requestOptions = { method: 'POST', body: data, headers: authHeader() };

  return (fetch(API_URL + 'delmovimiento', requestOptions).then(res => {
    if (res.ok) {
      return res;
    }
  }).then((res) => {
    return res;
  }).catch((error) => {
    addOfflineDel(id);
    return error
  }));

};

/**
 * Function aux for add and delete register to indexDB in offline mode
 * @param {*} id 
 */
const addOfflineDel = async (id) => {
  const db = await openDB('findemes', 1);
  await db.put('offlineDel', id);
  db.close();
}

/**
 * Send data to server in offline mode in indexDB in frontend
 * @param {*} id 
 * @param {*} row 
 * @returns 
 */
const delOffline = async (id, row) => {
  const data = new FormData();
  data.append('email', user.email);
  data.append('id', id);
  data.append('row', JSON.stringify(row));

  const requestOptions = { method: 'POST', body: data, headers: authHeader() };

  return (fetch(API_URL + 'addmodbalance', requestOptions).then(res => {
    if (res.ok) {
      delOfflineIndexDb1(id);
      return res;
    }
  }).then((res) => {
    return res;
  }).catch((error) => {
    return error
  }));
}

/**
 * Function aux for delete register to indexDB in offline mode
 * @param {*} id 
 */
const delOfflineIndexDb1 = async (id) => {
  // Set a value in a store:
  const db = await openDB('findemes', 1);
  await db.delete('offlineDel', id);
  db.close();
}

///////////////////////////////////
//END MODULE BALANCE
///////////////////////////////////

///////////////////////////////////
//MODULE CATEGORY
///////////////////////////////////
/**
 * Get data of a category
 * @param {*} id 
 * @param {*} row 
 * @returns 
 */
const getCategoria = (id, row) => {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return (fetch(API_URL + 'getcategoria?email=' + user.email + '&id=' + id, requestOptions).then(handleResponse));
};

/**
 * Get list of categories
 * @param {*} id 
 * @param {*} row 
 * @returns 
 */
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

/**
 * Add data to a category
 * @param {*} id 
 * @param {*} row 
 * @returns 
 */
const addmodCategoria = (id, row) => {
  const data = new FormData();
  data.append('email', user.email);
  data.append('id', id);
  data.append('row', JSON.stringify(row));

  const requestOptions = { method: 'POST', body: data, headers: authHeader() };
  return (fetch(API_URL + 'addmodcategorias', requestOptions).then(handleResponse));
};

/**
 * Delete a category
 * @param {*} id 
 * @returns 
 */
const delCategoria = (id) => {
  const data = new FormData();
  data.append('email', user.email);
  data.append('id', id);

  const requestOptions = { method: 'POST', body: data, headers: authHeader() };
  return (fetch(API_URL + 'delcategoria', requestOptions).then(handleResponse));
};
///////////////////////////////////
//END MODULE CATEGORY
///////////////////////////////////

export default {

  delOffline,
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

  validEmails,
  getInforme,

};

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

  //guardamos el importe en - si es gastos en indexdb
  if (row.tipo == 'gastos') {
    row.importe = -row.importe;
  }

  const db = await openDB('findemes', 1);

  //Agregamos registor a indexDB
  //Buscamos el nombre de la categoria
  let cat = db.transaction('categorias').objectStore('categorias');
  let catname = await cat.get(row.categoriaid);
  row.categoria=catname.nombre;
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

//funcion auxiliar para agregar registo a indexdb en modo offline
const addOfflineAdd = async (id, row) => {

  //guardamos el importe en - si es gastos en indexdb
  if (row.tipo == 'gastos') {
    row.importe = -row.importe;
  }

  const db = await openDB('findemes', 1);
  await db.put('offlineAdd', row);
  db.close();
}

//envia al servidor los datos que estaban guardados en indexdb en modo offline FrontEnd
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

//funcin auxiliar para eliminar registo de indexdb en modo offline
const delOfflineIndexDb = async (id) => {
  // Set a value in a store:
  const db = await openDB('findemes', 1);
  await db.delete('offlineAdd', id);
  db.close();
}

//Trae el total del balance
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

//elimina un movimiento
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

//funcion auxiliar para agregar registo a eliminar a indexdb en modo offline
const addOfflineDel = async (id) => {
  const db = await openDB('findemes', 1);
  await db.put('offlineDel', id);
  db.close();
}

//envia al servidor los datos que estaban guardados en indexdb en modo offline FrontEnd para eliminar
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

//funcin auxiliar para eliminar registo de indexdb en modo offline
const delOfflineIndexDb1 = async (id) => {
  // Set a value in a store:
  const db = await openDB('findemes', 1);
  await db.delete('offlineDel', id);
  db.close();
}

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

  getlive,
  validEmails,
  getInforme,

};

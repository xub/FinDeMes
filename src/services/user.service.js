import authHeader from "./auth-header";
import { handleResponse } from './handle-response';

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

//trae estado del vida
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
const addmodBalance = (id, row) => {
  const data = new FormData();
  data.append('email', user.email);
  data.append('id', id);
  data.append('row', JSON.stringify(row));

  const requestOptions = { method: 'POST', body: data, headers: authHeader() };

  return ( fetch(API_URL + 'addmodbalance', requestOptions).then(res => {
    if (res.ok) {
      return res;
    }
  }).then((res) => {
    return res;
    // Do something with the response
  }).catch((error) => {
    return error
  }));

  //  fetch(API_URL + 'addmodbalance', requestOptions).then((res) => {
  //    if (res.ok) {
  //      return res;
  //    }
  //    throw new Error('Algo salio mal');
  //  })
  //  .then((res) => {
  //    return 'Error'
  //    // Do something with the response
  //  })
  //  .catch((error) => {
  //    console.log(error);
  //    return error
  //  });

};

//Trae el total del balance
const getTotal = (id, row) => {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return (fetch(API_URL + 'gettotal?email=' + user.email + '&id=' + id, requestOptions).then(handleResponse));
};

//Genera la tabla del balance
const getBalance = (id, row) => {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return (fetch(API_URL + 'getbalance?email=' + user.email + '&id=' + id, requestOptions).then(handleResponse));
};

//trae el total del balance
const getBalanceid = (id, row) => {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return (fetch(API_URL + 'getbalanceid?email=' + user.email + '&id=' + id, requestOptions).then(handleResponse));
};

//elimina una movimiento
const delMovimiento = (id) => {
  const data = new FormData();
  data.append('email', user.email);
  data.append('id', id);

  const requestOptions = { method: 'POST', body: data, headers: authHeader() };
  return (fetch(API_URL + 'delmovimiento', requestOptions).then(handleResponse));
};

//trae el total del balance
const getCategoria = (id, row) => {

  const requestOptions = { method: 'GET', headers: authHeader() };
  return (fetch(API_URL + 'getcategoria?email=' + user.email + '&id=' + id, requestOptions).then(handleResponse));
};

//trae el total del balance
const getCategorias = (id, row) => {

  const requestOptions = { method: 'GET', headers: authHeader() };
  return (fetch(API_URL + 'getcategorias?email=' + user.email + '&id=' + id, requestOptions).then(handleResponse));
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

  getCategoria,
  getCategorias,
  addmodCategoria,
  delCategoria,

  getGrafico,

  getlive,
  validEmails,
  getInforme,

};

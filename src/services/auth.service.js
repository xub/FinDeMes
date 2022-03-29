import axios from "axios";
import jwt_decode from "jwt-decode";

const API_URL = "https://api.findemes.ar/api/";
//const API_URL = "http://localhost:8080/api/auth/";

const register = (_username, _email, _password) => {
  return axios.post(API_URL + "signup", {
    _username,
    _email,
    _password,
  });
};

const login = (_username, _password) => {
  var details = {
    '_username': _username,
    '_password': _password
  };

  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }

  formBody = formBody.join("&");

  return axios
    .post(API_URL + "login_check", formBody,  {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}} )
    .then(response => {
      if (response.data.token) {
        var data = jwt_decode(response.data.token);
        data.accessToken = response.data.token;
        data.username = data.email;
        localStorage.setItem("user", JSON.stringify(data));
      }        
      
      return response.data.token;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
};

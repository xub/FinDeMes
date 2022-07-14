/**
 * PWA FinDeFes
 * update 04/2022
 * By Sergio Sam 
 */

import axios from "axios";

export default axios.create({
  baseURL: "https://api.findemes.ar/api/v1/",
  headers: {
    "Content-type": "application/json",
  },
});

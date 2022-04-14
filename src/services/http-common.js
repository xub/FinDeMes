import axios from "axios";

export default axios.create({
  baseURL: "https://devapi.findemes.ar/api/v1/",
  headers: {
    "Content-type": "application/json",
  },
});

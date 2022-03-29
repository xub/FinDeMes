import axios from "axios";

export default axios.create({
  baseURL: "https://api.findemes.ar/api/v1/",
  headers: {
    "Content-type": "application/json",
  },
});

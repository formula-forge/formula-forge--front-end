import axios from "axios";

export default axios.create({
  baseURL: "https://home.xn--qby.cf/api",
  headers: {
    "Content-type": "image/*",
  },
  withCredentials: true,
});

import userService from "../services/user-service";

function getUserName(id) {
  if (localStorage.getItem(id)) {
    return localStorage.getItem(id);
  } else {
    userService
      .getInfo(id)
      .then((res) => {
        localStorage.setItem(id, res.data.data.name);
        return res.data.data.name;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

export default getUserName;

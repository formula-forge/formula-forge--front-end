import http from "./http-common";

class LogService {
  login(username, phone, password) {
    const message = {};
    if (username) message.username = username;
    if (phone) message.phone = phone;
    message.password = password;
    return http.post("/token", message);
  }
  logout() {
    return http.delete("/token");
  }
}
// eslint-disable-next-line
export default new LogService();

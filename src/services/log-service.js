import http from "./http-common";

class LogService {
  login(username, phone, password, code) {
    const message = {};
    if (username) message.username = username;
    if (phone) message.phone = phone;
    if (password) message.password = password;
    if (code) message.code = code;
    return http.post("/token", message);
  }
  logout() {
    return http.delete("/token");
  }
}
// eslint-disable-next-line
export default new LogService();

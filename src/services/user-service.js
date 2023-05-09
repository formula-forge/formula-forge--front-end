import http from "./http-common";

class userService {
  getSms(phone) {
    return http.get(`/user/sms?phone=${phone}&type=register`);
  }
  register(verifyCode, phone, username, password) {
    return http.post("/user", {
      verifyCode,
      phone,
      name: username,
      password,
    });
  }
  getInfo(userId) {
    return http.get(`/user/${userId}`);
  }
  getYourself() {
    return http.get("/user");
  }
  changeInfo(name, phone, motto, isProtected) {
    let data = {};
    if (name) data.name = name;
    if (phone) data.phone = phone;
    if (motto) data.motto = motto;
    if (isProtected) data.protected = isProtected;
    return http.patch("/user", data);
  }
}

export default new userService();

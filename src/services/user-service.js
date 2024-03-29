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
  changeInfo(name, detail, phone, avatar, motto, isProtected) {
    console.log(isProtected);
    return http.patch("/user", {
      name,
      detail,
      phone,
      avatar,
      motto,
      protected: isProtected,
    });
  }
  changePassword(verifyCode, phone, password) {
    return http.patch(`/user/password`, { verifyCode, phone, password });
  }
}

export default new userService();

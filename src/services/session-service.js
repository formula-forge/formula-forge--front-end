import http from "./http-common";

class SessionService {
  getAll() {
    return http.get("/session");
  }
  getFriendSession(id) {
    return http.get(`/session/user/${id}`);
  }
  getGroupSession(id) {
    return http.get(`/session/group/${id}`);
  }
  haveReadFriend(id) {
    return http.patch(`/session/user/${id}`);
  }
  haveReadGroup(id) {
    return http.patch(`/session/group/${id}`);
  }
}

export default new SessionService();

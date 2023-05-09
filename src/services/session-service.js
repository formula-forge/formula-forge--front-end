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
  deleteSession(isGroup, id) {
    if (isGroup) {
      return http.delete(`/session/group/${id}`);
    } else {
      return http.delete(`/session/user/${id}`);
    }
  }
}

export default new SessionService();

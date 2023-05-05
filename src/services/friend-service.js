import http from "./http-common";

class FriendService {
  getAll() {
    return http.get("/friends");
  }

  getByClass(friendClass) {
    return http.get(`/friends?class=${friendClass}`);
  }

  postNewFriend(receiver, message, classification, nickname) {
    return http.post(`/friends/application`, {
      receiver,
      message,
      classification,
      nickname,
    });
  }

  getAllNewFriend() {
    return http.get(`/friends/application`);
  }

  agreeNewFriend(friendId, applicationId, classification, nickname) {
    return http.get(`/friends`, {
      friendId,
      applicationId,
      classification,
      nickname,
    });
  }

  deleteFriend(friendId) {
    return http.delete(`/friends/${friendId}`);
  }

  patchFriend(friendId, message) {
    return http.patch(`/friends/${friendId}`, message);
  }
}
// eslint-disable-next-line
export default new FriendService();

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

  directAddFriend(receiver, classification, nickname) {
    return http.post(`/friends`, {
      userId: receiver,
      classification,
      nickname,
    });
  }

  getAllNewFriend() {
    return http.get(`/friends/application`);
  }

  agreeNewFriend(friendId, application, classification, nickname) {
    return http.post(`/friends`, {
      userId: friendId,
      application,
      classification,
      nickname,
    });
  }

  deleteFriend(friendId) {
    return http.delete(`/friends/${friendId}`);
  }

  changeFriendInfo(friendId, classification, nickname) {
    let data = {};
    if (classification) data.classification = classification;
    if (nickname) data.nickname = nickname;
    return http.patch(`/friends/${friendId}`, data);
  }
}
// eslint-disable-next-line
export default new FriendService();

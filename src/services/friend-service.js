import http from "./http-common";

class FriendDataService {
  getAll() {
    return http.get("/friends");
  }

  getByClass(friendClass) {
    return http.get(`/friends?class=${friendClass}`);
  }

  postNewFriend(freindId, message) {
    return http.post(`/friends/application?friendId=${freindId}`, message);
  }

  getNewFriend() {
    return http.get(`/friends/application`);
  }

  deleteFriend(friendId) {
    return http.delete(`/friends/${friendId}`);
  }

  patchFriend(friendId, message) {
    return http.patch(`/friends/${friendId}`, message);
  }
}
// eslint-disable-next-line
export default new FriendDataService();

import http from "./http-common";

class FriendDataService {
  getAll() {
    return http.get("/friends");
  }

  get(id) {
    return http.get(`/friends/${id}`);
  }

  create(data) {
    return http.post("/friends", data);
  }

  update(id, data) {
    return http.put(`/friends/${id}`, data);
  }

  delete(id) {
    return http.delete(`/friends/${id}`);
  }

  /* // This is not used in the app
  deleteAll() {
    return http.delete(`/friends`);
  } 
  */

  findByTitle(title) {
    return http.get(`/friends?title=${title}`);
  }
}

export default new FriendDataService();

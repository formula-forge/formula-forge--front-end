import http from "./http-common";

class GroupDataService {
  getAll() {
    return http.get("/group");
  }
  getById(id) {
    return http.get(`/group/${id}`);
  }
  createGroup(name, avatar) {
    return http.post("/group", { name, avatar });
  }
  updateGroup(id, name, avatar) {
    return http.patch(`/group/${id}`, { name, avatar });
  }
  deleteGroup(id) {
    return http.delete(`/group/${id}`);
  }
  getMembers(id) {
    return http.get(`/group/${id}/member`);
  }
  addMember(id, userId) {
    return http.post(`/group/${id}/member`, { userId });
  }
  deleteMember(id, userId) {
    return http.delete(`/group/${id}/member/${userId}`);
  }
}

export default new GroupDataService();

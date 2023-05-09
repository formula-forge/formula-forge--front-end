import http from "./http-common";

class FormulaService {
  getAll() {
    return http.get("/formula");
  }
  putAll() {
    return http.put("/formula");
  }
}

export default new FormulaService();

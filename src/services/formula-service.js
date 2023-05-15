import http from "./http-common";

class FormulaService {
  getAll() {
    return http.get("/formula");
  }
  putAll(allFormula) {
    return http.put("/formula", allFormula);
  }
}

export default new FormulaService();

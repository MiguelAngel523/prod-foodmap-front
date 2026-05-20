import http from '@/services/http.js'

class ValoracioService {
  getPlat = (idUsuari, idPlat) => {
    return http.get(`/api/valoracio/${idUsuari}/${idPlat}`);
  }

  doValoracio = (idUsuari, idPlat, puntuacio, comentari) => {
    return http.post('/api/valoracio', {usuariId: idUsuari, platId: idPlat, puntuacio: puntuacio, comentari: comentari});
  }

  getResum = (idPlat) => {
    return http.get(`/api/ia/${idPlat}`);
  }
}
export default new ValoracioService()

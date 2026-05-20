import http from '@/services/http.js'

class PlatsService {
  getPlats = () => {
    return http.get('/api/plats')
  }

  getPlat = (id) => {
    return http.get('/api/plats/' + id)
  }

  search = ({ query, idsCultura }) => {
    const params = new URLSearchParams()

    if (query) params.append('query', query)

    if (idsCultura && idsCultura.length > 0) {
      idsCultura.forEach((id) => params.append('idsCultura[]', id))
    }
    return http.get('/api/plats/search', { params })
  }
  
  getCultures = () => {
    return http.get('/api/plats/cultures/all')
  }

}
export default new PlatsService()
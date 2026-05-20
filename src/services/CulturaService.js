import http from '@/services/http.js'

class PlatsService {
  getCultures = () => {
    return http.get('/api/cultures')
  }
}
export default new PlatsService()

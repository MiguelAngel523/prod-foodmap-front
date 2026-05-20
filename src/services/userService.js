import http from '@/services/http.js'

class UserService {

    login = (email, password) => {
        return http.post('/login', {email, password});
    }

    getUser = () => {
      return http.get('/admin/usuari/auth/logged');
    }

    register = (user) => {
      return http.post('/register', user);
    }

    logout = () => {
      return http.post('/logout');
    }
}
export default new UserService()
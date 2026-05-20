import { defineStore } from 'pinia'
import userService from "@/services/userService.js";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    idUser: null,
    user: null,
    roles: [],
  }),
  getters: {
    idUser: (state) => state.idUser,
    isAdmin: (state) => state.roles.includes('ROLE_ADMIN'),
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async login(email, password) {
        await userService.login(email, password)
        const user = await userService.getUser();
        this.user = user.data
        this.roles = user.data.roles
    },

    async register(nom, email, password) {
      await userService.register({nom, email, password});
    },

    async getUser() {
      const user = await userService.getUser();
      this.idUser = user.data.id
      this.user = user.data
      this.roles = user.data.roles
    },

    async logout() {
      this.idUser = null
      this.user = null
      this.roles = []
      await userService.logout();
    },
  },
})
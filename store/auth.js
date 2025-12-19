import { defineStore } from "pinia";
// import Cookie from "js-cookie";
// import ApiService from "~/store/common.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    is_authenticated: false,
    is_logged: false,
    auth_dfi: null,
    user_details_dfi: null,
    is_logging_in: true,
    dialog_login: false
  }),
  actions: {
    setToken(token) {
      this.auth_dfi = token
    },
    setAuth(user, from_mid=true) {
      console.log("setAuth")
      this.is_authenticated = true
      this.user_details_dfi = user
      this.is_logged = Date.now()
      this.is_logging_in = false
      // Cookie.set('auth_dfi', user.token)
      // console.log("Cookie", Cookie)
      // console.log("auth_dfi", Cookie.get('auth_dfi'))
      if (!from_mid){
        const token = useCookie('auth_dfi')
        token.value = user.token
      }
      this.auth_dfi = user.token
    },
    checkAuthSimple() {
      // const cookie_auth = Cookie.get('auth_dfi')
      const cookie_auth = useCookie('auth_dfi')

      // console.log("checkAuthSimple")
      return new Promise((resolve) => {
        if (this.is_logged) {
          // console.log("hay auth", this.auth_dfi)
          let last_login = this.is_logged
          if (!!last_login && last_login + (3600*24*1000) > Date.now()){
            // console.log("NO hay datos recientes")
            this.purgeAuth()
            return resolve()
          }
          else{
            // console.log("hay datos recientes")
          }
        }
        else if (cookie_auth.value) {
          // console.log("hay cookie", this.auth_dfi)
          this.auth_dfi = cookie_auth.value
          this.getLogin()
        }
        else {
          // console.log("NO ESTÁ LOGUEADO")
          return resolve()
        }
        return resolve(this.getCurrentUser())
      })
    },
    getCurrentUser() {
      if (this.user_details_dfi){
        return this.user_details_dfi
      }
      else{
        // console.log("en el nuxt no hay datos del usuario")
        return null
      }
    },
    async getLogin() {
      try {
        const { get, setAuthHeader } = useApi()
        setAuthHeader()
        const data = await get('/login/')
        return this.hasLogged(data)
      } catch (err) {
        console.log("LOGIN_ERROR", err)
        return this.hasNotLogged(`Server error: ${err}`)
      }
      // console.log("getLogin")
      // return new Promise((resolve) => {
      // this.setHeader()
      // ApiService.get('/login/')
      //   .then(({data, status}) => {
      //     if (status !== 204)
      //       return this.hasLogged(data)
      //     else
      //       return this.hasNotLogged('Not Content (204)')
      //   })
      //   .catch(err =>{
      //     console.log("LOGIN_ERROR", err)
      //     return this.hasNotLogged(`Server error: ${err}`)
      //   })
      // })
    },
    async loginMail(params) {
      try {
        const { post } = useApi();
        let response = await post('/login/', params)

        // console.log("loginMail", response)
        this.hasLogged(response, false)
        return response

      } catch (err) {
        return {error:err}
      }
    },
    hasLogged(userData, from_mid=true) {
      this.purgeAuth(from_mid)
      this.setAuth(userData, from_mid)
      // if (userData.profile && userData.profile.organization){
      //   console.log("seteamos la organización")
      //   commit("arropa/SET_ORGANIZATION_ID", userData.profile.organization.id, {root: true})
      // }
      if (!from_mid){
        this.redirectLogin()
      }
    },
    hasNotLogged(error) {
      this.is_logging_in = false
      console.error(error)
      this.purgeAuth()
      return null
    },
    redirectLogin() {
      const router = useRouter()
      return router.push({ path: '/dashboard'})
      // return $router.push({ path: '/dashboard'})
    },
    purgeAuth(from_mid=true) {
      // console.log("purgeAuth")
      this.is_authenticated = false
      this.user_details_dfi = null
      this.auth_dfi = null
      // Cookie.remove('auth_dfi')
      if (!from_mid){
        const token = useCookie('auth_dfi')
        token.value = null
      }
    },
    logout() {
      const router = useRouter()
      // const route = useRoute()
      this.purgeAuth(false)
      return router.push({ path: '/login' })
    }
  },
  getters: {
    authCookie() {
      // console.log("Cookie", Cookie)
      // console.log("authCookie", Cookie.get('auth_dfi'))
      const token = useCookie('auth_dfi')
      return token.value
      // return true
    }
  }

});
export const useApi = () => {
  const config = useRuntimeConfig()

  let apiFetch = $fetch.create({
    baseURL: config.public.apiUrl || process.env.NUXT_API_URL,
    headers: {
      'Content-Type': 'application/json'
    },
    onRequestError({ request, options, error }) {
      console.error('Request error:', error)
    },
    onResponseError({ request, response, options }) {
      console.error('Response error:', response.status, response.statusText)
    }
  })

  // Function to set auth header
  // const setAuthHeader = () => {
  //   const cookie_auth = useCookie('auth_dfi');
  //   console.log('Setting auth header with cookie:', cookie_auth);
  //   console.log('apiFetch defaults before:', apiFetch);
  //   if (cookie_auth.value) {
  //     apiFetch.defaults.headers = {
  //       ...apiFetch.defaults.headers,
  //       'Authorization': `Token ${cookie_auth.value}`
  //     };
  //   }
  // };
  // Function to set auth header
  const setAuthHeader = () => {
    const cookie_auth = useCookie('auth_dfi');
    // Crear un nuevo objeto para las cabeceras
    const headers = {
      'Content-Type': 'application/json'
    };

    if (cookie_auth.value) {
      headers['Authorization'] = `Token ${cookie_auth.value}`;
    }

    // Reconfigurar apiFetch con las nuevas cabeceras
    apiFetch = $fetch.create({
      baseURL: config.public.apiUrl || process.env.NUXT_API_URL,
      headers,
      // onRequestError: apiFetch.onRequestError,
      // onResponseError: apiFetch.onResponseError
      onRequestError({ request, options, error }) {
        console.error('Request error:', error);
        return Promise.reject(error);
      },
      onResponseError({ request, response, options }) {
        console.error('Response error:', response.status, response.statusText);
        return Promise.reject(response);
      }
    });
  };

  return {
    apiFetch,
    setAuthHeader,

    async get(endpoint, options = {}) {
      return apiFetch(endpoint, { method: 'GET', ...options });
    },

    async post(endpoint, body = null, options = {}) {
      return apiFetch(endpoint, {
        method: 'POST',
        body,
        ...options
      });
    },

    async put(endpoint, body = null, options = {}) {
      return apiFetch(endpoint, {
        method: 'PUT',
        body,
        ...options
      });
    },

    async deleteData(endpoint, options = {}) {
      return apiFetch(endpoint, { method: 'DELETE', ...options });
    },

    async patch(endpoint, body = null, options = {}) {
      return apiFetch(endpoint, {
        method: 'PATCH',
        body,
        ...options
      });
    }
  }
}
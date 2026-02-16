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

  return {
    apiFetch,

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
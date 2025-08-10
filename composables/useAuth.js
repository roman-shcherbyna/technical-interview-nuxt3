
export function useAuth() {
    const token = useCookie('token')
    const config = useRuntimeConfig()

    async function login(data) {
        const res = await $fetch(`${config.public.apiBase}/auth/login`, {
            method: 'POST',
            body: data,
        })
        token.value = res.access_token
    }

    function register(data) {
        return $fetch(`${config.public.apiBase}/auth/register`, {
            method: 'POST',
            body: data,
        })
    }

    function logout() {
        token.value = null
    }

    return { login, register, logout, token }
}
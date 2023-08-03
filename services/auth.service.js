import http from '@/plugin/https'

const path = "/siswa/login"

const authService = {
    async login(payload) {
        const { data } = await http.post(path, payload)

        return data
    },

    async me(token) {
        const { data } = await http.post('/siswa/me', token)

        return data
    },
}

export default authService
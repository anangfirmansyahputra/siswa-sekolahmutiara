import http from '@/plugin/https'

const path = "/admin/pengumuman"

const pengumumanService = {
    async get(params) {
        const { data } = await http.post(`${path}/all`, params)

        return data
    }
}

export default pengumumanService
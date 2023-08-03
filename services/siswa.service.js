import http from '@/plugin/https'

const siswaService = {
    async edit(payload, id) {
        const { data } = await http.put(`/siswa/${id}/update`, payload);

        return data;
    },
}

export default siswaService

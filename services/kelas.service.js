import http from "@/plugin/https";

const kelasService = {
    async create(payload) {
        const { data } = await http.post("/kelas", payload);

        return data;
    },

    async edit(payload, id) {
        const { data } = await http.put(`/kelas/${id}`, payload);

        return data;
    },

    async delete(ids) {
        const { data } = await http.post("/kelas/delete", ids);
        return data;
    },
};

export default kelasService;

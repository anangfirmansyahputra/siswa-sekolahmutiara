import http from "@/plugin/https";

const prestasiService = {
    async create(payload) {
        const { data } = await http.post("/prestasi/upload", payload);

        return data;
    },

    async delete(id) {
        const { data } = await http.delete(`/prestasi/${id}`);

        return data;
    },
};

export default prestasiService;

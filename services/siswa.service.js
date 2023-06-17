import http from "@/plugin/https";

const siswaService = {
    async edit(payload, id) {
        const { data } = await http.put(`/siswa/${id}`, payload);

        return data;
    },

    async delete(nis) {
        const { data } = await http.post("/siswa/delete", { nis: nis });

        return data;
    },
};

export default siswaService;

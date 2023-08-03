import http from "@/plugin/https";

const ekstrakurikulerService = {
    async get(params) {
        const { data } = await http.get('/pengajar/ekstrakurikuler', params)

        return data
    },

    async delete(ids) {
        const { data } = await http.post("/ekstrakurikuler/delete", { ids: ids });

        return data;
    },

    async join(payload) {
        const { data } = await http.post("/ekstrakurikuler/join", payload);

        return data;
    },
};

export default ekstrakurikulerService;

import http from "@/plugin/https";

const ekstrakurikulerService = {
    async delete(ids) {
        const { data } = await http.post("/ekstrakurikuler/delete", { ids: ids });

        return data;
    },
};

export default ekstrakurikulerService;

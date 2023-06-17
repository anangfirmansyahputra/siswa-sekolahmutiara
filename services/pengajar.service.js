import http from "@/plugin/https";

const pengajarService = {
    async delete(niks) {
        const { data } = await http.post("/pengajar/delete", { niks });

        return data;
    },
};

export default pengajarService;

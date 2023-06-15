import axios from "axios";

const { default: instance } = require("@/helpers/instance");

class AuthServices {
    login(username, password) {
        return axios.post(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/admin/login", {
            username: username,
            password: password,
        });
    }

    loginSiswa(nis, password) {
        return axios.post(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/siswa/login", {
            nis: nis,
            password: password,
        });
    }

    loginPengajar(username, password) {
        return axios.post(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/admin/login", {
            username: username,
            password: password,
        });
    }
}

export default new AuthServices();

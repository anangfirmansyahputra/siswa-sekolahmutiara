import AuthService from "@/services/auth.service";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";

export default NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            authorize: async (credentials) => {
                const { username, password, role, nis } = credentials;

                let loginResponse;

                switch (role) {
                    case "admin":
                        loginResponse = await AuthService.login(username, password);
                        break;
                    case "siswa":
                        loginResponse = await AuthService.loginSiswa(nis, password);
                        break;
                    default:
                }

                if (loginResponse) {
                    return {
                        user: loginResponse.data,
                    };
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
        async session({ session, token, user }) {
            session.user = token;
            return session;
        },
    },
    secret: "tolejs"
});

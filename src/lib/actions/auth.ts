"use server";

import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export async function loginWithCredentials(email: string, password: string) {
    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Email ou senha inválidos" };
                default:
                    return { error: "Erro ao fazer login" };
            }
        }
        throw error;
    }
}

export async function loginWithGoogle() {
    await signIn("google", { redirectTo: "/dashboard" });
}

export async function loginWithGithub() {
    await signIn("github", { redirectTo: "/dashboard" });
}

export async function logout() {
    await signOut({ redirectTo: "/" });
}

export async function registerUser(
    name: string,
    email: string,
    password: string
) {
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: "Este email já está em uso" };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // Auto login after registration
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard",
        });
    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Erro ao criar conta" };
    }
}

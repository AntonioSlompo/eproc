"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface SupplierFormData {
    name: string;
    email: string;
    phone?: string;
    address?: string;
}

export async function getSuppliers(params?: {
    search?: string;
    page?: number;
    limit?: number;
}) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const where = params?.search
        ? {
            OR: [
                { name: { contains: params.search, mode: "insensitive" as const } },
                { email: { contains: params.search, mode: "insensitive" as const } },
            ],
        }
        : {};

    const [suppliers, total] = await Promise.all([
        prisma.supplier.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma.supplier.count({ where }),
    ]);

    return {
        suppliers,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getSupplier(id: string) {
    const supplier = await prisma.supplier.findUnique({
        where: { id },
    });

    if (!supplier) {
        throw new Error("Fornecedor não encontrado");
    }

    return supplier;
}

export async function createSupplier(data: SupplierFormData) {
    try {
        // Validate required fields
        if (!data.name || !data.email) {
            return { error: "Nome e email são obrigatórios" };
        }

        // Check if email already exists
        const existing = await prisma.supplier.findFirst({
            where: { email: data.email },
        });

        if (existing) {
            return { error: "Este email já está cadastrado" };
        }

        await prisma.supplier.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone || null,
                address: data.address || null,
            },
        });

        revalidatePath("/dashboard/suppliers");
    } catch (error) {
        console.error("Error creating supplier:", error);
        return { error: "Erro ao criar fornecedor" };
    }

    redirect("/dashboard/suppliers");
}

export async function updateSupplier(id: string, data: SupplierFormData) {
    try {
        // Validate required fields
        if (!data.name || !data.email) {
            return { error: "Nome e email são obrigatórios" };
        }

        // Check if email already exists (excluding current supplier)
        const existing = await prisma.supplier.findFirst({
            where: {
                email: data.email,
                NOT: { id },
            },
        });

        if (existing) {
            return { error: "Este email já está cadastrado" };
        }

        await prisma.supplier.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone || null,
                address: data.address || null,
            },
        });

        revalidatePath("/dashboard/suppliers");
        revalidatePath(`/dashboard/suppliers/${id}/edit`);
    } catch (error) {
        console.error("Error updating supplier:", error);
        return { error: "Erro ao atualizar fornecedor" };
    }

    redirect("/dashboard/suppliers");
}

export async function deleteSupplier(id: string) {
    try {
        // Check if supplier has products
        const productsCount = await prisma.product.count({
            where: { supplierId: id },
        });

        if (productsCount > 0) {
            return {
                error: `Não é possível excluir este fornecedor pois existem ${productsCount} produto(s) associado(s)`,
            };
        }

        await prisma.supplier.delete({
            where: { id },
        });

        revalidatePath("/dashboard/suppliers");
        return { success: true };
    } catch (error) {
        console.error("Error deleting supplier:", error);
        return { error: "Erro ao excluir fornecedor" };
    }
}

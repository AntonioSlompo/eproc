"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SupplierStatus, PersonType, TaxRegime, IeIndicator } from "@prisma/client";

// Matching the Zod schema from the form roughly
export interface SupplierFormData {
    id?: string;
    type: PersonType;
    document: string;
    name: string;
    tradeName?: string;
    stateRegistration?: string;
    municipalRegistration?: string;
    cnaeMainCode?: string;
    cnaeMainDesc?: string;

    // Address
    cep?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    latitude?: number;
    longitude?: number;

    // Contact
    email?: string;
    phone?: string;
    website?: string;

    // Fiscal
    taxRegime?: TaxRegime;
    ieIndicator?: IeIndicator;

    observations?: string;
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
                { document: { contains: params.search, mode: "insensitive" as const } },
                { tradeName: { contains: params.search, mode: "insensitive" as const } },
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
        include: {
            contacts: true,
            bankAccounts: true
        }
    });

    if (!supplier) {
        throw new Error("Fornecedor não encontrado");
    }

    return supplier;
}

export async function createSupplier(data: SupplierFormData) {
    try {
        // Basic validation
        if (!data.name || !data.document) {
            return { error: "Razão Social e Documento são obrigatórios" };
        }

        // Check if document already exists
        const existing = await prisma.supplier.findUnique({
            where: { document: data.document },
        });

        if (existing) {
            return { error: "Este documento (CNPJ/CPF) já está cadastrado" };
        }

        const newSupplier = await prisma.supplier.create({
            data: {
                type: data.type,
                document: data.document,
                name: data.name,
                tradeName: data.tradeName,
                stateRegistration: data.stateRegistration,
                municipalRegistration: data.municipalRegistration,
                cnaeMainCode: data.cnaeMainCode,
                cnaeMainDesc: data.cnaeMainDesc,

                cep: data.cep,
                street: data.street,
                number: data.number,
                complement: data.complement,
                neighborhood: data.neighborhood,
                city: data.city,
                state: data.state,
                latitude: data.latitude,
                longitude: data.longitude,

                taxRegime: data.taxRegime || null,
                ieIndicator: data.ieIndicator || null,
                website: data.website,
                notes: data.observations,

                // For now, create a default contact if email/phone provided
                contacts: (data.email || data.phone) ? {
                    create: {
                        name: data.name.split(" ")[0], // Placeholder
                        email: data.email,
                        phone: data.phone,
                        role: "Principal"
                    }
                } : undefined
            },
        });

        revalidatePath("/dashboard/suppliers");
        return { success: true, id: newSupplier.id };
    } catch (error) {
        console.error("Error creating supplier:", error);
        return { error: "Erro ao criar fornecedor" };
    }
}

export async function updateSupplier(id: string, data: SupplierFormData) {
    try {
        if (!data.name || !data.document) {
            return { error: "Razão Social e Documento são obrigatórios" };
        }

        // Check for duplicate document on other suppliers
        const existing = await prisma.supplier.findFirst({
            where: {
                document: data.document,
                NOT: { id },
            },
        });

        if (existing) {
            return { error: "Este documento já está em uso por outro fornecedor" };
        }

        await prisma.supplier.update({
            where: { id },
            data: {
                type: data.type,
                document: data.document,
                name: data.name,
                tradeName: data.tradeName,
                stateRegistration: data.stateRegistration,
                municipalRegistration: data.municipalRegistration,
                cnaeMainCode: data.cnaeMainCode,
                cnaeMainDesc: data.cnaeMainDesc,

                cep: data.cep,
                street: data.street,
                number: data.number,
                complement: data.complement,
                neighborhood: data.neighborhood,
                city: data.city,
                state: data.state,
                latitude: data.latitude,
                longitude: data.longitude,

                taxRegime: data.taxRegime || null,
                ieIndicator: data.ieIndicator || null,
                website: data.website,
                notes: data.observations,
            },
        });

        // Note: Contacts/BankAccounts update logic to be added later if needed via sub-forms

        revalidatePath("/dashboard/suppliers");
        revalidatePath(`/dashboard/suppliers/${id}/edit`);

        return { success: true };
    } catch (error) {
        console.error("Error updating supplier:", error);
        return { error: "Erro ao atualizar fornecedor" };
    }
}

export async function deleteSupplier(id: string) {
    try {
        // Check products using count
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

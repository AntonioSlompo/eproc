"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { SupplierForm } from "@/components/suppliers/supplier-form";
import { updateSupplier, deleteSupplier } from "@/lib/actions/suppliers";
import { use } from "react";

interface EditSupplierPageProps {
    params: Promise<{ id: string }>;
    supplier: {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
}

export default function EditSupplierPageClient({ params, supplier }: EditSupplierPageProps) {
    const router = useRouter();
    const { id } = use(params);

    const handleDelete = async () => {
        if (!confirm(`Tem certeza que deseja excluir o fornecedor "${supplier.name}"?`)) {
            return;
        }

        const result = await deleteSupplier(id);

        if (result?.error) {
            alert(result.error);
        } else {
            router.push("/dashboard/suppliers");
        }
    };

    return (
        <div>
            <PageHeader
                title="Editar Fornecedor"
                description={`Editando: ${supplier.name}`}
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Fornecedores", href: "/dashboard/suppliers" },
                    { label: supplier.name },
                ]}
            />

            <SupplierForm
                initialData={{
                    name: supplier.name,
                    email: supplier.email ?? "",
                    phone: supplier.phone ?? "",
                    address: supplier.address ?? "",
                }}
                onSubmit={(data) => updateSupplier(id, data)}
                submitLabel="Salvar Alterações"
                onDelete={handleDelete}
            />
        </div>
    );
}

import { PageHeader } from "@/components/ui/page-header";
import { SupplierForm } from "@/components/suppliers/supplier-form";
import { createSupplier } from "@/lib/actions/suppliers";

export default function NewSupplierPage() {
    return (
        <div>
            <PageHeader
                title="Novo Fornecedor"
                description="Cadastre um novo fornecedor no sistema"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Fornecedores", href: "/dashboard/suppliers" },
                    { label: "Novo" },
                ]}
            />

            <SupplierForm />
        </div>
    );
}

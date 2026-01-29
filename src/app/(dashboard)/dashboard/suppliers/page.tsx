import { getSuppliers } from "@/lib/actions/suppliers";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { SuppliersTable } from "@/components/suppliers/suppliers-table";

interface PageProps {
    searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function SuppliersPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const search = params.search || "";
    const page = parseInt(params.page || "1");

    const { suppliers, pagination } = await getSuppliers({
        search,
        page,
        limit: 10,
    });

    return (
        <div>
            <PageHeader
                title="Fornecedores"
                description="Gerencie os fornecedores cadastrados no sistema"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Fornecedores" },
                ]}
                actions={
                    <Link href="/dashboard/suppliers/new">
                        <Button>
                            <Plus className="w-4 h-4" />
                            Novo Fornecedor
                        </Button>
                    </Link>
                }
            />

            <SuppliersTable
                suppliers={suppliers}
                pagination={pagination}
                searchQuery={search}
            />
        </div>
    );
}

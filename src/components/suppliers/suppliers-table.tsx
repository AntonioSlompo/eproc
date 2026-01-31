"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteSupplier } from "@/lib/actions/suppliers";
import Link from "next/link";

interface Supplier {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    createdAt: Date;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface SuppliersTableProps {
    suppliers: Supplier[];
    pagination: Pagination;
    searchQuery: string;
}

export function SuppliersTable({ suppliers, pagination, searchQuery }: SuppliersTableProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [search, setSearch] = useState(searchQuery);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleSearch = (value: string) => {
        setSearch(value);
        startTransition(() => {
            const params = new URLSearchParams();
            if (value) params.set("search", value);
            router.push(`/dashboard/suppliers?${params.toString()}`);
        });
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja excluir o fornecedor "${name}"?`)) {
            return;
        }

        setDeletingId(id);
        const result = await deleteSupplier(id);

        if (result?.error) {
            alert(result.error);
            setDeletingId(null);
        } else {
            router.refresh();
        }
    };

    const handlePageChange = (newPage: number) => {
        startTransition(() => {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            params.set("page", newPage.toString());
            router.push(`/dashboard/suppliers?${params.toString()}`);
        });
    };

    return (
        <div className="space-y-[var(--spacing-md)]">
            {/* Search Bar */}
            <div className="flex items-center gap-[var(--spacing-md)]">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                        type="search"
                        placeholder="Buscar por nome ou email..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="glass-card rounded-lg border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-[var(--spacing-lg)] py-[var(--spacing-md)] text-left text-[var(--text-sm)] font-semibold">Nome</th>
                                <th className="px-[var(--spacing-lg)] py-[var(--spacing-md)] text-left text-[var(--text-sm)] font-semibold">Email</th>
                                <th className="px-[var(--spacing-lg)] py-[var(--spacing-md)] text-left text-[var(--text-sm)] font-semibold">Telefone</th>
                                <th className="px-[var(--spacing-lg)] py-[var(--spacing-md)] text-right text-[var(--text-sm)] font-semibold">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {suppliers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-[var(--spacing-lg)] py-[var(--spacing-xl)] text-center text-neutral-400 text-[var(--text-sm)]">
                                        {search ? (
                                            <>Nenhum fornecedor encontrado para "{search}"</>
                                        ) : (
                                            <>Nenhum fornecedor cadastrado</>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                suppliers.map((supplier) => (
                                    <tr
                                        key={supplier.id}
                                        className="hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-[var(--spacing-lg)] py-[var(--spacing-md)]">
                                            <div className="font-medium text-[var(--text-base)]">{supplier.name}</div>
                                        </td>
                                        <td className="px-[var(--spacing-lg)] py-[var(--spacing-md)] text-neutral-400 text-[var(--text-sm)]">{supplier.email}</td>
                                        <td className="px-[var(--spacing-lg)] py-[var(--spacing-md)] text-neutral-400 text-[var(--text-sm)]">
                                            {supplier.phone || "-"}
                                        </td>
                                        <td className="px-[var(--spacing-lg)] py-[var(--spacing-md)]">
                                            <div className="flex items-center justify-end gap-[var(--spacing-xs)]">
                                                <Link href={`/dashboard/suppliers/${supplier.id}/edit`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(supplier.id, supplier.name)}
                                                    disabled={deletingId === supplier.id}
                                                    isLoading={deletingId === supplier.id}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="px-[var(--spacing-lg)] py-[var(--spacing-md)] border-t border-white/10 flex items-center justify-between">
                        <div className="text-[var(--text-sm)] text-neutral-400">
                            Mostrando {suppliers.length} de {pagination.total} fornecedores
                        </div>
                        <div className="flex items-center gap-[var(--spacing-xs)]">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1 || isPending}
                            >
                                Anterior
                            </Button>
                            <div className="text-[var(--text-sm)] text-neutral-400">
                                Página {pagination.page} de {pagination.totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages || isPending}
                            >
                                Próxima
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

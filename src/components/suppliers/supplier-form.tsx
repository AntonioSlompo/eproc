"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormSection } from "@/components/ui/form-section";
import { SupplierFormData } from "@/lib/actions/suppliers";

interface SupplierFormProps {
    initialData?: SupplierFormData & { id?: string };
    onSubmit: (data: SupplierFormData) => Promise<{ error?: string } | void>;
    submitLabel?: string;
    onDelete?: () => Promise<void>;
}

export function SupplierForm({
    initialData,
    onSubmit,
    submitLabel = "Salvar",
    onDelete,
}: SupplierFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<SupplierFormData>({
        name: initialData?.name || "",
        email: initialData?.email || "",
        phone: initialData?.phone || "",
        address: initialData?.address || "",
    });

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Nome é obrigatório";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email é obrigatório";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email inválido";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        startTransition(async () => {
            const result = await onSubmit(formData);

            if (result?.error) {
                alert(result.error);
            }
        });
    };

    const handleCancel = () => {
        router.push("/dashboard/suppliers");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-[var(--spacing-lg)]">
            <FormSection title="Informações Básicas">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-md)]">
                    <Input
                        label="Nome"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        error={errors.name}
                        required
                        disabled={isPending}
                    />

                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        error={errors.email}
                        required
                        disabled={isPending}
                    />
                </div>

                <Input
                    label="Telefone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    helperText="Formato: (11) 99999-9999"
                    disabled={isPending}
                />

                <Textarea
                    label="Endereço"
                    name="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    helperText="Endereço completo do fornecedor"
                    disabled={isPending}
                />
            </FormSection>

            {/* Actions */}
            <div className="flex items-center justify-between">
                <div>
                    {onDelete && (
                        <Button
                            type="button"
                            variant="danger"
                            onClick={onDelete}
                            disabled={isPending}
                        >
                            Excluir Fornecedor
                        </Button>
                    )}
                </div>
                <div className="flex items-center gap-[var(--spacing-sm)]">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" isLoading={isPending}>
                        {submitLabel}
                    </Button>
                </div>
            </div>
        </form>
    );
}

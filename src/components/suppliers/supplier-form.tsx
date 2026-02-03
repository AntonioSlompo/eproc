"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormSection } from "@/components/ui/form-section";
import { AddressForm, AddressData } from "@/components/address-form";
import { fetchCompanyData } from "@/lib/actions/brasil-api";
import { createSupplier, SupplierFormData } from "@/lib/actions/suppliers"; // Correct Import
import { Loader2, Save, MapPin, Building2, Wallet, Tag } from "lucide-react";

// Schema Validation matches the Prisma Enum somewhat
const formSchema = z.object({
    // Identity
    type: z.enum(["FISICA", "JURIDICA"]),
    document: z.string().min(1, "Documento obrigatório"), // CNPJ/CPF
    name: z.string().min(1, "Razão Social obrigatória"),
    tradeName: z.string().optional(),
    stateRegistration: z.string().optional(),
    municipalRegistration: z.string().optional(),

    // Fiscal
    cnaeMainCode: z.string().optional(),
    cnaeMainDesc: z.string().optional(),
    taxRegime: z.enum(["SIMPLES_NACIONAL", "LUCRO_PRESUMIDO", "LUCRO_REAL"]).optional(),
    ieIndicator: z.enum(["CONTRIBUINTE", "ISENTO", "NAO_CONTRIBUINTE"]).optional(),

    // Address (Synced via AddressForm)
    cep: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),

    // Extra
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    website: z.string().optional(),
    observations: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function SupplierForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSearchingCnpj, setIsSearchingCnpj] = useState(false);
    const [activeTab, setActiveTab] = useState<"identity" | "address" | "financial" | "category">("identity");

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "JURIDICA",
            document: "",
            name: "",
            tradeName: "",
            address: { latitude: 0, longitude: 0 } as any // Hack for nested update
        }
    });

    const { register, handleSubmit, setValue, watch, formState: { errors } } = form;
    const document = watch("document");
    const personType = watch("type");

    // Mask CPF/CNPJ
    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (personType === "JURIDICA") {
            if (value.length > 14) value = value.slice(0, 14);
            value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
        } else {
            if (value.length > 11) value = value.slice(0, 11);
            value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        }
        setValue("document", value);
    };

    // Auto-fill from CNPJ
    const handleCnpjBlur = async () => {
        const cleanDoc = document.replace(/\D/g, "");
        if (personType === "JURIDICA" && cleanDoc.length === 14) {
            setIsSearchingCnpj(true);
            try {
                const data = await fetchCompanyData(cleanDoc);
                if (data) {
                    setValue("name", data.name);
                    setValue("tradeName", data.tradeName);
                    setValue("cnaeMainCode", data.cnaeMainCode);
                    setValue("cnaeMainDesc", data.cnaeMainDesc);
                    setValue("email", data.email || "");
                    setValue("phone", data.phone || "");

                    // Address fill (Triggers AddressForm update via props)
                    setValue("cep", data.cep);
                    setValue("street", data.street);
                    setValue("number", data.number);
                    setValue("neighborhood", data.neighborhood);
                    setValue("city", data.city);
                    setValue("state", data.state);
                    setValue("complement", data.complement);
                }
            } finally {
                setIsSearchingCnpj(false);
            }
        }
    };

    // Address form sync
    const handleAddressChange = (data: AddressData) => {
        setValue("cep", data.cep);
        setValue("street", data.street);
        setValue("number", data.number);
        setValue("complement", data.complement);
        setValue("neighborhood", data.neighborhood);
        setValue("city", data.city);
        setValue("state", data.state);
        setValue("latitude", data.latitude);
        setValue("longitude", data.longitude);
    };

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            // Map form data to server action expected format
            const result = await createSupplier(data as SupplierFormData);

            if (result.error) {
                alert(result.error);
            } else {
                router.push("/dashboard/suppliers");
            }
        } catch (error) {
            console.error(error);
            alert("Erro inesperado ao salvar");
        } finally {
            setIsLoading(false);
        }
    };

    // Construct address object for AddressForm
    const currentAddress: AddressData = {
        cep: watch("cep") || "",
        street: watch("street") || "",
        number: watch("number") || "",
        complement: watch("complement") || "",
        neighborhood: watch("neighborhood") || "",
        city: watch("city") || "",
        state: watch("state") || "",
        latitude: watch("latitude"),
        longitude: watch("longitude"),
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Tabs / Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10">
                <Button
                    type="button"
                    variant={activeTab === "identity" ? "default" : "ghost"}
                    onClick={() => setActiveTab("identity")}
                    className="gap-2"
                >
                    <Building2 className="w-4 h-4" /> Dados Cadastrais
                </Button>
                <Button
                    type="button"
                    variant={activeTab === "address" ? "default" : "ghost"}
                    onClick={() => setActiveTab("address")}
                    className="gap-2"
                >
                    <MapPin className="w-4 h-4" /> Endereço
                </Button>
                <Button
                    type="button"
                    variant={activeTab === "financial" ? "default" : "ghost"}
                    onClick={() => setActiveTab("financial")}
                    className="gap-2"
                >
                    <Wallet className="w-4 h-4" /> Fiscal & Financeiro
                </Button>
                <Button
                    type="button"
                    variant={activeTab === "category" ? "default" : "ghost"}
                    onClick={() => setActiveTab("category")}
                    className="gap-2"
                >
                    <Tag className="w-4 h-4" /> Categorização
                </Button>
            </div>

            {/* TAB: IDENTITY */}
            <div className={activeTab === "identity" ? "block" : "hidden"}>
                <FormSection title="Identificação" description="Dados principais da entidade">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Tipo de Pessoa */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-neutral-300">Tipo de Pessoa</label>
                            <div className="flex bg-neutral-900/50 p-1 rounded-lg border border-white/10 w-fit">
                                <button
                                    type="button"
                                    onClick={() => setValue("type", "JURIDICA")}
                                    className={`px-4 py-2 rounded-md text-sm transition-all ${personType === "JURIDICA" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-neutral-400 hover:text-white"}`}
                                >
                                    Pessoa Jurídica
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setValue("type", "FISICA")}
                                    className={`px-4 py-2 rounded-md text-sm transition-all ${personType === "FISICA" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-neutral-400 hover:text-white"}`}
                                >
                                    Pessoa Física
                                </button>
                            </div>
                        </div>

                        {/* CNPJ / CPF */}
                        <div className="relative">
                            <Input
                                label={personType === "JURIDICA" ? "CNPJ" : "CPF"}
                                value={document}
                                onChange={handleDocumentChange}
                                onBlur={handleCnpjBlur}
                                placeholder={personType === "JURIDICA" ? "00.000.000/0000-00" : "000.000.000-00"}
                                error={errors.document?.message}
                                disabled={isLoading || isSearchingCnpj}
                            />
                            {isSearchingCnpj && (
                                <div className="absolute right-3 top-[38px] animate-spin text-blue-400">
                                    <Loader2 className="w-4 h-4" />
                                </div>
                            )}
                        </div>

                        <Input
                            label="Razão Social / Nome Completo"
                            {...register("name")}
                            error={errors.name?.message}
                            placeholder={isSearchingCnpj ? "Buscando..." : ""}
                            disabled={isLoading}
                        />

                        <Input
                            label="Nome Fantasia"
                            {...register("tradeName")}
                            error={errors.tradeName?.message}
                            placeholder={isSearchingCnpj ? "Buscando..." : ""}
                            disabled={isLoading}
                        />

                        <Input
                            label="Inscrição Estadual"
                            {...register("stateRegistration")}
                            disabled={isLoading}
                        />

                        <Input
                            label="Inscrição Municipal"
                            {...register("municipalRegistration")}
                            disabled={isLoading}
                        />

                        {/* CNAE (Read-only display mostly, but search updates it) */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-neutral-300">CNAE Principal</label>
                            <div className="flex gap-2 items-center">
                                <div className="flex-1">
                                    <Input
                                        value={`${watch("cnaeMainCode") || ""} - ${watch("cnaeMainDesc") || ""}`}
                                        disabled
                                        className="bg-neutral-900/50"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-neutral-500">Preenchido automaticamente pelo CNPJ.</p>
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Contatos Principais" description="E-mail e telefone para comunicação">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="E-mail Principal"
                            {...register("email")}
                            error={errors.email?.message}
                            disabled={isLoading}
                        />
                        <Input
                            label="Telefone"
                            {...register("phone")}
                            error={errors.phone?.message}
                            disabled={isLoading}
                        />
                        <Input
                            label="Website"
                            {...register("website")}
                            error={errors.website?.message}
                            disabled={isLoading}
                        />
                    </div>
                </FormSection>
            </div>

            {/* TAB: ADDRESS */}
            <div className={activeTab === "address" ? "block" : "hidden"}>
                <FormSection title="Localização" description="Endereço principal e coordenadas geográficas">
                    <AddressForm
                        data={currentAddress}
                        onChange={handleAddressChange}
                        disabled={isLoading}
                        errors={errors as any} // Typing loose for now
                    />
                </FormSection>
            </div>

            {/* TAB: FINANCIAL */}
            <div className={activeTab === "financial" ? "block" : "hidden"}>
                <FormSection title="Dados Fiscais" description="Regime de tributação e indicadores">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Regime de Tributação</label>
                            <select
                                {...register("taxRegime")}
                                className="w-full h-[var(--input-height)] rounded-lg bg-[var(--surface)] border border-white/10 px-3 text-sm focus:border-blue-500 outline-none"
                            >
                                <option value="">Selecione...</option>
                                <option value="SIMPLES_NACIONAL">Simples Nacional</option>
                                <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
                                <option value="LUCRO_REAL">Lucro Real</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Indicador de IE</label>
                            <select
                                {...register("ieIndicator")}
                                className="w-full h-[var(--input-height)] rounded-lg bg-[var(--surface)] border border-white/10 px-3 text-sm focus:border-blue-500 outline-none"
                            >
                                <option value="CONTRIBUINTE">Contribuinte ICMS</option>
                                <option value="ISENTO">Contribuinte Isento</option>
                                <option value="NAO_CONTRIBUINTE">Não Contribuinte</option>
                            </select>
                        </div>
                    </div>
                </FormSection>
            </div>

            {/* TAB: CATEGORIZATION */}
            <div className={activeTab === "category" ? "block" : "hidden"}>
                <FormSection title="Categorização" description="Como este parceiro será classificado no sistema">
                    <div className="p-8 text-center text-neutral-500 border border-dashed border-neutral-700 rounded-lg">
                        Em breve: Seleção de categorias, anexos e certificações.
                    </div>
                </FormSection>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-500">
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Fornecedor
                </Button>
            </div>
        </form>
    );
}

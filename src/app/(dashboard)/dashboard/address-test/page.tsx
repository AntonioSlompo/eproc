"use client";

import { useState } from "react";
import { AddressForm, AddressData } from "@/components/address-form";
import { PageHeader } from "@/components/ui/page-header";
import { CnaeSearch } from "@/components/cnae-search";
import { NcmSearch, Ncm } from "@/components/ncm-search";

export default function AddressTestPage() {
    const [address, setAddress] = useState<AddressData>({
        cep: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        latitude: 0,
        longitude: 0,
    });

    const [cnae, setCnae] = useState<any>(null);
    const [ncm, setNcm] = useState<Ncm | null>(null);

    const handleAddressChange = (data: AddressData) => {
        setAddress(data);
    };

    return (
        <div className="min-h-screen bg-[var(--background)] p-[var(--spacing-lg)]">
            <PageHeader
                title="Laboratório de Componentes Inteligentes"
                description="Ambiente de teste para validação de componentes de dados e geolocalização."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-xl)] mt-[var(--spacing-xl)]">
                {/* Coluna 1: Endereço */}
                <div className="space-y-[var(--spacing-lg)]">
                    <section className="glass-card p-[var(--spacing-lg)] rounded-xl border border-white/5">
                        <h2 className="text-xl font-bold mb-[var(--spacing-md)] text-blue-400 flex items-center gap-2">
                            📍 Endereço & Mapa
                        </h2>
                        <AddressForm data={address} onChange={handleAddressChange} />

                        <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-neutral-400">
                            <p className="mb-2 font-bold text-neutral-300">Estado Atual:</p>
                            <pre>{JSON.stringify(address, null, 2)}</pre>
                        </div>
                    </section>
                </div>

                {/* Coluna 2: Dados Fiscais */}
                <div className="space-y-[var(--spacing-lg)]">
                    <section className="glass-card p-[var(--spacing-lg)] rounded-xl border border-white/5">
                        <h2 className="text-xl font-bold mb-[var(--spacing-md)] text-purple-400 flex items-center gap-2">
                            💼 Dados Fiscais & Atividade
                        </h2>

                        <div className="space-y-8">
                            {/* CNAE */}
                            <div>
                                <h3 className="text-sm font-semibold text-neutral-400 mb-4 uppercase tracking-wider">Atividade Econômica</h3>
                                <CnaeSearch
                                    onChange={(val) => setCnae(val)}
                                />
                                {cnae && (
                                    <div className="mt-2 p-3 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
                                        Selecionado: <strong>{cnae.id}</strong> - {cnae.descricao}
                                    </div>
                                )}
                            </div>

                            <div className="h-px bg-white/10" />

                            {/* NCM */}
                            <div>
                                <h3 className="text-sm font-semibold text-neutral-400 mb-4 uppercase tracking-wider">Classificação de Produtos</h3>
                                <NcmSearch
                                    onChange={(val) => setNcm(val)}
                                />
                                {ncm && (
                                    <div className="mt-2 p-3 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
                                        Selecionado: <strong>{ncm.codigo}</strong> - {ncm.descricao}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="glass-card p-[var(--spacing-lg)] rounded-xl border border-white/5">
                        <h2 className="text-xl font-bold mb-4 text-green-400">✅ Verificação</h2>
                        <ul className="space-y-2 text-sm text-neutral-300">
                            <li className="flex items-center gap-2">
                                <span className={address.cep ? "text-green-400" : "text-neutral-600"}>●</span>
                                Busca de CEP e Endereço
                            </li>
                            <li className="flex items-center gap-2">
                                <span className={address.latitude ? "text-green-400" : "text-neutral-600"}>●</span>
                                Geocodificação (Mapa)
                            </li>
                            <li className="flex items-center gap-2">
                                <span className={cnae ? "text-green-400" : "text-neutral-600"}>●</span>
                                Busca de CNAE (IBGE)
                            </li>
                            <li className="flex items-center gap-2">
                                <span className={ncm ? "text-green-400" : "text-neutral-600"}>●</span>
                                Busca de NCM (BrasilAPI)
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}

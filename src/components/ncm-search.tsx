"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, ChevronDown, Check } from "lucide-react";

export interface Ncm {
    codigo: string; // "01012100"
    descricao: string; // "Cavalos reprodutores de raça pura"
}

interface NcmSearchProps {
    value?: string;
    onChange: (ncm: Ncm) => void;
    disabled?: boolean;
    error?: string;
}

export function NcmSearch({ value, onChange, disabled, error }: NcmSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Ncm[]>([]);
    const [allNcms, setAllNcms] = useState<Ncm[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedNcm, setSelectedNcm] = useState<Ncm | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Fetch all NCMs on mount
    // Note: NCM list is large (~13k items), so we might want to cache this or use a server action in production.
    // For now, client-side fetch is acceptable for MVP.
    useEffect(() => {
        const fetchNcms = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("https://brasilapi.com.br/api/ncm/v1");
                const data = await response.json();
                // BrasilAPI returns array of { codigo, descricao, data_inicio, data_fim, tipo_ato, numero_ato, ano_ato }
                setAllNcms(data);
                console.log(`Loaded ${data.length} NCMs`);
            } catch (err) {
                console.error("Failed to fetch NCMs:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNcms();
    }, []);

    // Filter results based on query
    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const numericQuery = lowerQuery.replace(/\D/g, "");

        // Performance optimization: only filter if we have a query
        // Limit results to 50 to avoid rendering lag
        const filtered = allNcms.filter((ncm) => {
            // If numeric query matches code
            if (numericQuery.length > 0 && ncm.codigo.includes(numericQuery)) {
                return true;
            }
            // If text query matches description
            return ncm.descricao.toLowerCase().includes(lowerQuery);
        }).slice(0, 50);

        setResults(filtered);
    }, [query, allNcms]);

    // Handle outside click to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (ncm: Ncm) => {
        setSelectedNcm(ncm);
        onChange(ncm);
        setQuery("");
        setIsOpen(false);
    };

    // Format NCM code for display (e.g. 1234.56.78)
    const formatNcm = (code: string) => {
        return code.replace(/^(\d{4})(\d{2})(\d{2})/, "$1.$2.$3");
    };

    return (
        <div className="w-full relative" ref={wrapperRef}>
            <label className="block text-[var(--text-sm)] font-medium mb-[var(--spacing-xs)] text-neutral-300">
                NCM (Classificação Fiscal)
            </label>

            {/* Selected Value Display */}
            {selectedNcm && !isOpen && (
                <div
                    onClick={() => setIsOpen(true)}
                    className="mb-2 p-3 rounded-lg border border-purple-500/30 bg-purple-500/10 flex items-center justify-between cursor-pointer hover:bg-purple-500/20 transition-colors"
                >
                    <div className="flex-1 overflow-hidden">
                        <div className="flex items-baseline gap-2">
                            <span className="font-mono text-purple-300 font-bold whitespace-nowrap">
                                {formatNcm(selectedNcm.codigo)}
                            </span>
                            <span className="text-xs text-purple-400 border border-purple-500/30 px-1.5 rounded">Fiscal</span>
                        </div>

                        <div className="text-sm text-neutral-200 truncate mt-1" title={selectedNcm.descricao}>
                            {selectedNcm.descricao}
                        </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-purple-400 flex-shrink-0 ml-2" />
                </div>
            )}

            {/* Default Input */}
            {(!selectedNcm || isOpen) && (
                <div className="relative">
                    <Input
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        placeholder={selectedNcm ? "Alterar NCM..." : "Digite o código (ex: 7318) ou descrição (ex: Parafuso)..."}
                        className="pl-10"
                        onFocus={() => setIsOpen(true)}
                        disabled={disabled}
                        error={error}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </div>
                </div>
            )}

            {/* Dropdown Results */}
            {isOpen && results.length > 0 && (
                <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-lg border border-white/10 bg-[#0a0a0a] shadow-xl backdrop-blur-xl">
                    {results.map((ncm) => (
                        <button
                            key={ncm.codigo}
                            onClick={() => handleSelect(ncm)}
                            className="w-full text-left px-4 py-3 hover:bg-purple-600/20 transition-colors border-b border-white/5 last:border-0 group"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-purple-400 font-bold group-hover:text-purple-300">
                                    {formatNcm(ncm.codigo)}
                                </span>
                            </div>
                            <span className="text-sm text-neutral-300 group-hover:text-white line-clamp-2">
                                {ncm.descricao}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* No Results */}
            {isOpen && query && results.length === 0 && !isLoading && (
                <div className="absolute z-50 w-full mt-1 p-4 text-center rounded-lg border border-white/10 bg-[#0a0a0a] text-neutral-400 text-sm">
                    Nenhum NCM encontrado para "{query}"
                </div>
            )}
            {/* Simple message for huge list initially */}
            {isOpen && !query && !isLoading && allNcms.length > 0 && (
                <div className="absolute z-50 w-full mt-1 p-3 text-center rounded-lg border border-white/10 bg-[#0a0a0a] text-neutral-500 text-xs">
                    Digite para filtrar {allNcms.length} registros fiscais...
                </div>
            )}
        </div>
    );
}

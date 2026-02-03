"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Check, ChevronDown } from "lucide-react";

export interface Cnae {
    id: string; // The formatted code e.g. "6201-5/01"
    descricao: string;
}

interface CnaeSearchProps {
    value?: string;
    onChange: (cnae: Cnae) => void;
    disabled?: boolean;
    error?: string;
}

export function CnaeSearch({ value, onChange, disabled, error }: CnaeSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Cnae[]>([]);
    const [allCnaes, setAllCnaes] = useState<Cnae[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCnae, setSelectedCnae] = useState<Cnae | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Fetch all CNAEs on mount
    useEffect(() => {
        const fetchCnaes = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("https://servicodados.ibge.gov.br/api/v2/cnae/subclasses");
                const data = await response.json();
                const formattedData: Cnae[] = data.map((item: any) => ({
                    id: item.id,
                    descricao: item.descricao,
                }));
                setAllCnaes(formattedData);
                console.log(`Loaded ${formattedData.length} CNAEs`);
            } catch (err) {
                console.error("Failed to fetch CNAEs:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCnaes();
    }, []);

    // Filter results based on query
    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const numericQuery = lowerQuery.replace(/\D/g, "");

        const filtered = allCnaes.filter(
            (cnae) =>
                cnae.descricao.toLowerCase().includes(lowerQuery) ||
                (numericQuery.length > 0 && cnae.id.replace(/\D/g, "").includes(numericQuery))
        ).slice(0, 50); // Limit to 50 results for performance

        setResults(filtered);
    }, [query, allCnaes]);

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

    const handleSelect = (cnae: Cnae) => {
        setSelectedCnae(cnae);
        onChange(cnae);
        setQuery(""); // Clear query or keep it? Usually clearing is cleaner if we show selection elsewhere
        setIsOpen(false);
    };

    return (
        <div className="w-full relative" ref={wrapperRef}>
            <label className="block text-[var(--text-sm)] font-medium mb-[var(--spacing-xs)] text-neutral-300">
                CNAE (Atividade Econômica)
            </label>

            {/* Selected Value Display (if any) */}
            {selectedCnae && !isOpen && (
                <div
                    onClick={() => setIsOpen(true)}
                    className="mb-2 p-3 rounded-lg border border-blue-500/30 bg-blue-500/10 flex items-center justify-between cursor-pointer hover:bg-blue-500/20 transition-colors"
                >
                    <div>
                        <span className="font-mono text-blue-300 font-bold mr-2">{selectedCnae.id}</span>
                        <span className="text-sm text-neutral-200">{selectedCnae.descricao}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-blue-400" />
                </div>
            )}

            {/* Default Input if nothing selected or searching */}
            {(!selectedCnae || isOpen) && (
                <div className="relative">
                    <Input
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        placeholder={selectedCnae ? "Alterar CNAE..." : "Busque por código ou descrição ex: Software..."}
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
                    {results.map((cnae) => (
                        <button
                            key={cnae.id}
                            onClick={() => handleSelect(cnae)}
                            className="w-full text-left px-4 py-3 hover:bg-blue-600/20 transition-colors border-b border-white/5 last:border-0 flex items-start gap-3 group"
                        >
                            <span className="font-mono text-blue-400 font-bold whitespace-nowrap group-hover:text-blue-300">{cnae.id}</span>
                            <span className="text-sm text-neutral-300 group-hover:text-white line-clamp-2">{cnae.descricao}</span>
                        </button>
                    ))}
                </div>
            )}

            {isOpen && query && results.length === 0 && !isLoading && (
                <div className="absolute z-50 w-full mt-1 p-4 text-center rounded-lg border border-white/10 bg-[#0a0a0a] text-neutral-400 text-sm">
                    Nenhum CNAE encontrado para "{query}"
                </div>
            )}
        </div>
    );
}

"use client";

import { useDensity } from "@/components/density-provider";
import { LayoutGrid, Layout, LayoutDashboard, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const densityOptions = [
    {
        value: "compact" as const,
        label: "Compacto",
        icon: LayoutGrid,
        description: "Máxima densidade",
    },
    {
        value: "comfortable" as const,
        label: "Confortável",
        icon: Layout,
        description: "Equilíbrio",
    },
    {
        value: "spacious" as const,
        label: "Espaçoso",
        icon: LayoutDashboard,
        description: "Mais espaço",
    },
];

export function DensityToggle() {
    const { density, setDensity } = useDensity();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const currentOption = densityOptions.find((opt) => opt.value === density) || densityOptions[1];
    const CurrentIcon = currentOption.icon;

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                aria-label="Alterar densidade"
            >
                <CurrentIcon className="w-5 h-5 text-neutral-400 group-hover:text-neutral-300" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[var(--background)] border border-white/20 rounded-lg shadow-2xl overflow-hidden animate-fade-in-up backdrop-blur-xl z-50">
                    <div className="p-2">
                        {densityOptions.map((option) => {
                            const Icon = option.icon;
                            const isActive = density === option.value;

                            return (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setDensity(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left group ${isActive
                                            ? "bg-primary/10 border border-primary/30"
                                            : "hover:bg-white/10 border border-transparent"
                                        }`}
                                >
                                    <Icon
                                        className={`w-4 h-4 ${isActive ? "text-primary" : "text-neutral-400 group-hover:text-neutral-300"
                                            }`}
                                    />
                                    <div className="flex-1">
                                        <div
                                            className={`text-sm font-medium ${isActive ? "text-primary" : "group-hover:text-neutral-300"
                                                }`}
                                        >
                                            {option.label}
                                        </div>
                                        <div className="text-xs text-neutral-500">{option.description}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

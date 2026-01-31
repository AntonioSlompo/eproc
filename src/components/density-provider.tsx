"use client";

import * as React from "react";

type Density = "compact" | "comfortable" | "spacious";

interface DensityContextType {
    density: Density;
    setDensity: (density: Density) => void;
}

const DensityContext = React.createContext<DensityContextType | undefined>(undefined);

export function DensityProvider({ children }: { children: React.ReactNode }) {
    const [density, setDensityState] = React.useState<Density>("comfortable");
    const [mounted, setMounted] = React.useState(false);

    // Load density from localStorage on mount
    React.useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("density") as Density;
        if (stored && ["compact", "comfortable", "spacious"].includes(stored)) {
            setDensityState(stored);
        }
    }, []);

    // Apply density to document element
    React.useEffect(() => {
        if (mounted) {
            document.documentElement.setAttribute("data-density", density);
        }
    }, [density, mounted]);

    const setDensity = React.useCallback((newDensity: Density) => {
        setDensityState(newDensity);
        localStorage.setItem("density", newDensity);
    }, []);

    // Prevent flash of wrong density
    if (!mounted) {
        return null;
    }

    return (
        <DensityContext.Provider value={{ density, setDensity }}>
            {children}
        </DensityContext.Provider>
    );
}

export function useDensity() {
    const context = React.useContext(DensityContext);
    if (context === undefined) {
        throw new Error("useDensity must be used within a DensityProvider");
    }
    return context;
}

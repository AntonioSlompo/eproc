"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import MapPicker to disable SSR
const MapPicker = dynamic(() => import("@/components/ui/map-picker"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full glass-card flex items-center justify-center text-neutral-400">Carregando mapa...</div>
});

export interface AddressData {
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    latitude?: number;
    longitude?: number;
}

interface AddressFormProps {
    data: AddressData;
    onChange: (data: AddressData) => void;
    errors?: Partial<Record<keyof AddressData, string>>;
    disabled?: boolean;
}

export function AddressForm({ data, onChange, errors, disabled }: AddressFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (field: keyof AddressData, value: string | number) => {
        onChange({ ...data, [field]: value });
    };

    const handleCoordsChange = (lat: number, lng: number) => {
        onChange({ ...data, latitude: lat, longitude: lng });
    };

    const fetchCoordinates = async (addressQuery: string) => {
        // We will try multiple strategies to get a location
        const strategies = [
            // 1. Postal Code Search (Very accurate for street segments)
            // Nominatim often finds the street segment just by CEP
            () => {
                const params = new URLSearchParams({
                    postalcode: data.cep,
                    country: "Brasil",
                    format: "json",
                    limit: "1"
                });
                return `https://nominatim.openstreetmap.org/search?${params.toString()}`;
            },
            // 2. Structured Search with Number: Street, City, State
            () => {
                const params = new URLSearchParams({
                    street: `${data.number ? data.number + ' ' : ''}${data.street}`,
                    city: data.city,
                    state: data.state,
                    country: "Brasil",
                    format: "json",
                    limit: "1"
                });
                return `https://nominatim.openstreetmap.org/search?${params.toString()}`;
            },
            // 3. Structured Search: Just Street (no number), City, State
            () => {
                const params = new URLSearchParams({
                    street: data.street,
                    city: data.city,
                    state: data.state,
                    country: "Brasil",
                    format: "json",
                    limit: "1"
                });
                return `https://nominatim.openstreetmap.org/search?${params.toString()}`;
            },
            // 4. Freeform Search: Street, Number, City, State
            // Sometimes freeform works better for complex street names
            () => {
                const query = `${data.street}, ${data.number || ""}, ${data.city}, ${data.state}, Brasil`;
                return `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
            },
            // 5. Structured Search: City and State only (Ultimate fallback)
            () => {
                const params = new URLSearchParams({
                    city: data.city,
                    state: data.state,
                    country: "Brasil",
                    format: "json",
                    limit: "1"
                });
                return `https://nominatim.openstreetmap.org/search?${params.toString()}`;
            }
        ];

        for (const strategy of strategies) {
            try {
                const url = strategy();

                const response = await fetch(url, {
                    headers: {
                        'Accept-Language': 'pt-BR'
                    }
                });
                const results = await response.json();

                if (results && results.length > 0) {
                    const { lat, lon } = results[0];
                    onChange({
                        ...data,
                        latitude: parseFloat(lat),
                        longitude: parseFloat(lon),
                    });
                    return; // Stop after first success
                }

                // Small delay between retries to be polite to the API
                await new Promise(resolve => setTimeout(resolve, 800));

            } catch (error) {
                // Silent catch
            }
        }
    };

    const fetchAddress = async (cep: string) => {
        const cleanCep = cep.replace(/\D/g, "");
        if (cleanCep.length !== 8) return;

        setIsLoading(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const address = await response.json();

            if (!address.erro) {
                // Construct address for geocoding
                const fullAddress = `${address.logradouro}, ${address.bairro}, ${address.localidade}, ${address.uf}, Brasil`;

                // Fetch coords immediately after getting address
                const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&limit=1`);
                const geoResults = await geoResponse.json();

                let lat = data.latitude;
                let lng = data.longitude;

                if (geoResults && geoResults.length > 0) {
                    lat = parseFloat(geoResults[0].lat);
                    lng = parseFloat(geoResults[0].lon);
                }

                onChange({
                    ...data,
                    cep: cep,
                    street: address.logradouro,
                    neighborhood: address.bairro,
                    city: address.localidade,
                    state: address.uf,
                    latitude: lat,
                    longitude: lng,
                });
            }
        } catch (error) {
            console.error("Error fetching address:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCepBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        fetchAddress(e.target.value);
    };

    // Auto-update coordinates when address fields change (debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            // Only search if we have at least Street and City
            if (data.street && data.city) {
                const query = `${data.street}, ${data.number || ""}, ${data.neighborhood || ""}, ${data.city}, ${data.state || ""}, Brasil`;
                fetchCoordinates(query);
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [data.street, data.number, data.neighborhood, data.city, data.state]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-[var(--spacing-md)]">
                {/* CEP */}
                <div className="md:col-span-3 relative">
                    <Input
                        label="CEP"
                        value={data.cep}
                        onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            if (value.length > 8) value = value.slice(0, 8);
                            if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, "$1-$2");
                            handleChange("cep", value);
                        }}
                        onBlur={handleCepBlur}
                        placeholder="00000-000"
                        maxLength={9}
                        error={errors?.cep}
                        disabled={disabled || isLoading}
                    />
                    {isLoading && (
                        <div className="absolute right-3 top-[38px] animate-spin text-blue-400">
                            <Loader2 className="w-4 h-4" />
                        </div>
                    )}
                </div>

                {/* Logradouro */}
                <div className="md:col-span-7">
                    <Input
                        label="Logradouro"
                        value={data.street}
                        onChange={(e) => handleChange("street", e.target.value)}
                        placeholder="Rua, Avenida, etc."
                        error={errors?.street}
                        disabled={disabled || isLoading}
                    />
                </div>

                {/* Número */}
                <div className="md:col-span-2">
                    <Input
                        label="Número"
                        value={data.number}
                        onChange={(e) => handleChange("number", e.target.value)}
                        placeholder="123"
                        error={errors?.number}
                        disabled={disabled}
                    />
                </div>

                {/* Complemento */}
                <div className="md:col-span-4">
                    <Input
                        label="Complemento"
                        value={data.complement}
                        onChange={(e) => handleChange("complement", e.target.value)}
                        placeholder="Apto, Bloco, etc."
                        error={errors?.complement}
                        disabled={disabled}
                    />
                </div>

                {/* Bairro */}
                <div className="md:col-span-4">
                    <Input
                        label="Bairro"
                        value={data.neighborhood}
                        onChange={(e) => handleChange("neighborhood", e.target.value)}
                        placeholder="Bairro"
                        error={errors?.neighborhood}
                        disabled={disabled || isLoading}
                    />
                </div>

                {/* Cidade */}
                <div className="md:col-span-3">
                    <Input
                        label="Cidade"
                        value={data.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        placeholder="Cidade"
                        error={errors?.city}
                        disabled={disabled || isLoading}
                    />
                </div>

                {/* UF */}
                <div className="md:col-span-1">
                    <Input
                        label="UF"
                        value={data.state}
                        onChange={(e) => handleChange("state", e.target.value)}
                        placeholder="UF"
                        maxLength={2}
                        error={errors?.state}
                        disabled={disabled || isLoading}
                    />
                </div>

                {/* Latitude & Longitude */}
                <div className="md:col-span-6">
                    <Input
                        label="Latitude"
                        value={data.latitude ?? ""}
                        onChange={(e) => handleChange("latitude", parseFloat(e.target.value))}
                        placeholder="-23.000000"
                        error={errors?.latitude ? String(errors.latitude) : undefined}
                        disabled={disabled}
                    />
                </div>
                <div className="md:col-span-6">
                    <Input
                        label="Longitude"
                        value={data.longitude ?? ""}
                        onChange={(e) => handleChange("longitude", parseFloat(e.target.value))}
                        placeholder="-46.000000"
                        error={errors?.longitude ? String(errors.longitude) : undefined}
                        disabled={disabled}
                    />
                </div>
            </div>

            {/* Map */}
            <div className="w-full">
                <label className="block text-[var(--text-sm)] font-medium mb-[var(--spacing-xs)] text-neutral-300">
                    Localização no Mapa (Arraste o pino para ajustar)
                </label>
                <div className="rounded-lg overflow-hidden border border-white/10 shadow-lg">
                    <MapPicker
                        lat={data.latitude || 0}
                        lng={data.longitude || 0}
                        onChange={handleCoordsChange}
                    />
                </div>
            </div>
        </div>
    );
}

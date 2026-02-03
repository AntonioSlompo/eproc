"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet generic marker icon missing assets
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapPickerProps {
    lat: number;
    lng: number;
    onChange: (lat: number, lng: number) => void;
    zoom?: number;
}

function LocationMarker({ lat, lng, onChange }: { lat: number; lng: number; onChange: (lat: number, lng: number) => void }) {
    const markerRef = useRef<L.Marker>(null);

    const map = useMap();

    useEffect(() => {
        map.flyTo([lat, lng], map.getZoom());
    }, [lat, lng, map]);

    useMapEvents({
        click(e) {
            onChange(e.latlng.lat, e.latlng.lng);
        },
    });

    return (
        <Marker
            draggable={true}
            eventHandlers={{
                dragend: () => {
                    const marker = markerRef.current;
                    if (marker != null) {
                        const { lat, lng } = marker.getLatLng();
                        onChange(lat, lng);
                    }
                },
            }}
            position={[lat, lng]}
            ref={markerRef}
        />
    );
}

export default function MapPicker({ lat, lng, onChange, zoom = 13 }: MapPickerProps) {
    // Default to São Paulo if coords are 0/0 (or invalid) just for initial view, 
    // but the marker will be at the passed lat/lng if valid.
    const centerLat = lat || -23.55052;
    const centerLng = lng || -46.633308;

    return (
        <div className="h-[300px] w-full rounded-lg overflow-hidden border border-white/10 relative z-0">
            <MapContainer
                center={[centerLat, centerLng]}
                zoom={zoom}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker lat={lat || centerLat} lng={lng || centerLng} onChange={onChange} />
            </MapContainer>
        </div>
    );
}

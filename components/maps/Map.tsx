"use client";

import { useEffect, useState } from "react";
import type { LatLngExpression } from "leaflet";

interface MapProps {
  center: [number, number]; // [lat, lng]
  markers?: Array<{
    position: [number, number];
    popup?: string;
  }>;
  zoom?: number;
  className?: string;
  height?: string;
}

export default function Map({
  center,
  markers = [],
  zoom = 13,
  className = "",
  height = "400px",
}: MapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;
    
    // Dynamically import react-leaflet components only on client
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
      import("leaflet/dist/leaflet.css"),
    ]).then(([reactLeaflet, L]) => {
      // Fix Leaflet default marker icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.5/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.5/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.5/dist/images/marker-shadow.png",
      });
      
      setMapComponents(reactLeaflet);
      setIsMounted(true);
    });
  }, []);

  // Show loading state during SSR or before mount
  if (!isMounted || !MapComponents || typeof window === "undefined") {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ height, width: "100%" }}
      >
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  return (
    <div className={className} style={{ height, width: "100%" }}>
      <MapContainer 
        center={center as LatLngExpression} 
        zoom={zoom} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.length > 0 ? (
          markers.map((marker, index) => (
            <Marker key={index} position={marker.position as LatLngExpression}>
              {marker.popup && <Popup>{marker.popup}</Popup>}
            </Marker>
          ))
        ) : (
          <Marker position={center as LatLngExpression}>
            <Popup>Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

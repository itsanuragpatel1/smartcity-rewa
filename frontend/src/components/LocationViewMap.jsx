import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Setup marker icon
const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationViewMap = ({ location, locality, ward }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current || !location || !location.lat || !location.lng) return;

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      dragging: true,
      scrollWheelZoom: false,
    }).setView([location.lat, location.lng], 15);
    
    mapRef.current = map;

    // Add Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Add Marker
    L.marker([location.lat, location.lng], { icon: markerIcon })
      .addTo(map)
      .bindPopup(`<b>${locality}</b><br/>Ward Number ${ward}`)
      .openPopup();

    // Clean up
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [location, locality, ward]);

  return (
    <div className="relative border border-govBorder rounded-lg overflow-hidden shadow-sm h-64 w-full bg-slate-100">
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
};

export default LocationViewMap;

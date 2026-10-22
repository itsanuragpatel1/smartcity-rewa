import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';

// Setup marker icon URLs to avoid Vite build path issues
const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Rewa Center Coordinates
const REWA_CENTER = { lat: 24.5362, lng: 81.3037 };

const LocationPicker = ({ value, onChange }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [gpsError, setGpsError] = useState(null);
  const [locating, setLocating] = useState(false);

  // Check if coordinates fall inside Rewa City limits
  const isInsideRewa = (lat, lng) => {
    return lat >= 24.40 && lat <= 24.65 && lng >= 81.15 && lng <= 81.45;
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet Map
    const initialLat = value?.lat || REWA_CENTER.lat;
    const initialLng = value?.lng || REWA_CENTER.lng;

    const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 14);
    mapRef.current = map;

    // Add OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Add Initial Marker
    const marker = L.marker([initialLat, initialLng], { icon: markerIcon }).addTo(map);
    markerRef.current = marker;

    // Handle Click Event to drop pin
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      
      if (!isInsideRewa(lat, lng)) {
        alert('Please select a location inside Rewa City boundaries.');
        return;
      }

      marker.setLatLng([lat, lng]);
      onChange({ lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) });
    });

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update marker position if coordinates change externally
  useEffect(() => {
    if (value && markerRef.current && mapRef.current) {
      const currentLatLng = markerRef.current.getLatLng();
      if (currentLatLng.lat !== value.lat || currentLatLng.lng !== value.lng) {
        markerRef.current.setLatLng([value.lat, value.lng]);
        mapRef.current.panTo([value.lat, value.lng]);
      }
    }
  }, [value]);

  // Use Browser GPS Location
  const handleGPSLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (!isInsideRewa(latitude, longitude)) {
          setGpsError('Your current GPS location is outside of Rewa City. Please select manually on the map.');
          setLocating(false);
          return;
        }

        const coords = { lat: Number(latitude.toFixed(6)), lng: Number(longitude.toFixed(6)) };
        onChange(coords);
        
        if (markerRef.current && mapRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
          mapRef.current.setView([latitude, longitude], 16);
        }

        setLocating(false);
      },
      (error) => {
        console.error('GPS Geolocation Error:', error);
        setGpsError('Could not retrieve your location. Make sure GPS/Location permission is enabled.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-semibold text-govTextPrimary flex items-center space-x-1.5">
          <MapPin className="h-4 w-4 text-primary" />
          <span>Incident Location (Inside Rewa)</span>
        </label>
        <button
          type="button"
          onClick={handleGPSLocation}
          disabled={locating}
          className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-primary bg-primary-light border border-blue-200 hover:bg-blue-100 rounded-md transition-colors disabled:opacity-50"
        >
          <Navigation className={`h-3 w-3 ${locating ? 'animate-spin' : ''}`} />
          <span>{locating ? 'Locating...' : 'Use Current GPS'}</span>
        </button>
      </div>

      <div className="relative border border-govBorder rounded-lg overflow-hidden shadow-inner">
        <div ref={mapContainerRef} className="h-72 w-full bg-slate-100" />
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] text-govTextSecondary rounded-md border border-govBorder z-10 select-none">
          Click on the map to relocate pin.
        </div>
      </div>

      {gpsError && (
        <p className="text-xs font-medium text-red-600 bg-red-50 p-2 rounded-md border border-red-100">
          {gpsError}
        </p>
      )}

      {value && (
        <div className="flex space-x-4 text-xs font-mono text-govTextSecondary bg-slate-50 p-2 rounded-md border border-govBorder">
          <div>Latitude: <span className="font-semibold text-govTextPrimary">{value.lat}</span></div>
          <div>Longitude: <span className="font-semibold text-govTextPrimary">{value.lng}</span></div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;

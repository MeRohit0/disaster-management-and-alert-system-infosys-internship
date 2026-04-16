import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet icon not showing up in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- HELPER COMPONENT FOR FLY-TO ---
// This component listens for changes to 'target' and moves the map
const MapRecenter = ({ target }: { target: [number, number] | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (target) {
      map.flyTo(target, 16, {
        animate: true,
        duration: 1.5 // Seconds for the smooth slide animation
      });
    }
  }, [target, map]);

  return null;
};

interface MapProps {
  locations: Array<{
    id: number;
    lat: number;
    lng: number;
    label: string;
    severity?: string;
  }>;
  center?: [number, number];
  selectedLocation: [number, number] | null; // New prop for Fly-To
}

const MapComponent: React.FC<MapProps> = ({ 
  locations, 
  center = [28.4595, 77.0266], 
  selectedLocation 
}) => {
  return (
    <div className="h-[450px] w-full rounded-[2rem] overflow-hidden border-4 border-white shadow-xl relative z-0">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* The component that handles the actual moving logic */}
        <MapRecenter target={selectedLocation} />

        {locations.map((loc) => (
          <Marker key={loc.id} position={[loc.lat, loc.lng]}>
            <Popup>
              <div className="font-sans">
                <p className="font-bold text-slate-900">{loc.label}</p>
                {loc.severity && (
                  <span className={`text-[10px] font-black uppercase ${
                    loc.severity === 'CRITICAL' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {loc.severity}
                  </span>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
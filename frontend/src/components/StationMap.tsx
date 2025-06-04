import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ChargingStation } from '../types';
import { Battery, Plug } from 'lucide-react';

interface StationMapProps {
  stations: ChargingStation[];
  height?: string;
}

const StationMap: React.FC<StationMapProps> = ({ stations, height = '600px' }) => {
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  
  // Calculate the center position based on stations or default to a position
  const center = stations.length > 0
    ? [
        stations.reduce((sum, station) => sum + station.location.latitude, 0) / stations.length,
        stations.reduce((sum, station) => sum + station.location.longitude, 0) / stations.length
      ] as [number, number]
    : [40.7128, -74.0060] as [number, number]; // Default to New York City

  const activeIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const inactiveIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {stations.map(station => (
          <Marker
            key={station.id}
            position={[station.location.latitude, station.location.longitude]}
            icon={station.status === 'active' ? activeIcon : inactiveIcon}
            eventHandlers={{
              click: () => {
                setSelectedStation(station);
              },
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="text-lg font-semibold">{station.name}</h3>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm">
                    <Battery className="h-4 w-4 mr-1" />
                    <span>{station.powerOutput} kW</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Plug className="h-4 w-4 mr-1" />
                    <span>{station.connectorType}</span>
                  </div>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      station.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default StationMap;
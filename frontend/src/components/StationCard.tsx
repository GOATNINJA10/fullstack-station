import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Edit, Trash2, Battery, Plug } from 'lucide-react';
import { ChargingStation } from '../types';

interface StationCardProps {
  station: ChargingStation;
  onDelete: (id: string) => void;
}

const StationCard: React.FC<StationCardProps> = ({ station, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${station.name}?`)) {
      onDelete(station.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{station.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            station.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>
              {station.location.latitude.toFixed(6)}, {station.location.longitude.toFixed(6)}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Battery className="h-4 w-4 mr-2" />
            <span>{station.powerOutput} kW</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Plug className="h-4 w-4 mr-2" />
            <span>{station.connectorType}</span>
          </div>
        </div>
        
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <Link 
            to={`/stations/${station.id}/edit`}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <Edit className="h-4 w-4 mr-1" />
            <span>Edit</span>
          </Link>
          
          <button 
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StationCard;
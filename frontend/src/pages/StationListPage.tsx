import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import StationCard from '../components/StationCard';
import StationFilter from '../components/StationFilter';
import { ChargingStation, ChargingStationFilters } from '../types';
import { getAllStations, deleteStation } from '../services/stationService';
import { useAuth } from '../contexts/AuthContext';

const StationListPage: React.FC = () => {
  const { authState } = useAuth();
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [filteredStations, setFilteredStations] = useState<ChargingStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectorTypes, setConnectorTypes] = useState<string[]>([]);
  
  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchStations();
    } else {
      // Clear stations when not authenticated
      setStations([]);
      setFilteredStations([]);
      setConnectorTypes([]);
    }
  }, [authState.token]);
  
  const fetchStations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getAllStations();
      setStations(data);
      setFilteredStations(data);
      
      // Extract unique connector types for filter
      const types = [...new Set(data.map(station => station.connectorType))];
      setConnectorTypes(types);
    } catch (err) {
      setError('Failed to load charging stations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (filters: ChargingStationFilters) => {
    let result = [...stations];
    
    if (filters.status && filters.status !== 'all') {
      result = result.filter(station => station.status === filters.status);
    }
    
    if (filters.connectorType) {
      result = result.filter(station => station.connectorType === filters.connectorType);
    }
    
    if (filters.minPowerOutput !== undefined) {
      result = result.filter(station => station.powerOutput >= filters.minPowerOutput!);
    }
    
    if (filters.maxPowerOutput !== undefined) {
      result = result.filter(station => station.powerOutput <= filters.maxPowerOutput!);
    }
    
    setFilteredStations(result);
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deleteStation(id);
      setStations(stations.filter(station => station.id !== id));
      setFilteredStations(filteredStations.filter(station => station.id !== id));
    } catch (err) {
      setError('Failed to delete charging station');
      console.error(err);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Charging Stations</h1>
        <Link
          to="/stations/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="mr-2 h-5 w-5" />
          <span>Add Station</span>
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <StationFilter 
        onFilterChange={handleFilterChange} 
        connectorTypes={connectorTypes}
      />
      
      {filteredStations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No charging stations found</h3>
          <p className="text-gray-500 mb-4">There are no charging stations that match your filters.</p>
          {stations.length === 0 && (
            <Link
              to="/stations/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="mr-2 h-5 w-5" />
              <span>Add Your First Station</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map(station => (
            <StationCard key={station.id} station={station} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StationListPage;

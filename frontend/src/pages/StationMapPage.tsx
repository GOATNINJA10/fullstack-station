import React, { useEffect, useState } from 'react';
import StationMap from '../components/StationMap';
import StationFilter from '../components/StationFilter';
import { ChargingStation, ChargingStationFilters } from '../types';
import { getAllStations } from '../services/stationService';

const StationMapPage: React.FC = () => {
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [filteredStations, setFilteredStations] = useState<ChargingStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectorTypes, setConnectorTypes] = useState<string[]>([]);
  
  useEffect(() => {
    fetchStations();
  }, []);
  
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
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Charging Stations Map</h1>
        <p className="text-gray-600">View all charging stations on the map. Click on a marker to see details.</p>
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
      
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Active</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Inactive</span>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Showing {filteredStations.length} of {stations.length} stations
        </div>
      </div>
      
      {filteredStations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No charging stations found</h3>
          <p className="text-gray-500">There are no charging stations that match your filters.</p>
        </div>
      ) : (
        <StationMap stations={filteredStations} height="70vh" />
      )}
    </div>
  );
};

export default StationMapPage;
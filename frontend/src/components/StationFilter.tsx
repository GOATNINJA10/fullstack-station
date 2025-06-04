import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { ChargingStationFilters } from '../types';

interface StationFilterProps {
  onFilterChange: (filters: ChargingStationFilters) => void;
  connectorTypes: string[];
}

const StationFilter: React.FC<StationFilterProps> = ({ 
  onFilterChange, 
  connectorTypes 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<ChargingStationFilters>({
    status: 'all',
    connectorType: '',
    minPowerOutput: undefined,
    maxPowerOutput: undefined
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value === '' ? undefined : name.includes('Power') ? Number(value) : value
    };
    
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const resetFilters = {
      status: 'all',
      connectorType: '',
      minPowerOutput: undefined,
      maxPowerOutput: undefined
    };
    
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <Filter className="mr-2 h-5 w-5" />
        <span>Filter Stations</span>
      </button>

      {isOpen && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Filter Options</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={filters.status || 'all'}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Connector Type</label>
              <select
                name="connectorType"
                value={filters.connectorType || ''}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                {connectorTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Power (kW)</label>
              <input
                type="number"
                name="minPowerOutput"
                value={filters.minPowerOutput || ''}
                onChange={handleFilterChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min Power"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Power (kW)</label>
              <input
                type="number"
                name="maxPowerOutput"
                value={filters.maxPowerOutput || ''}
                onChange={handleFilterChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max Power"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationFilter;
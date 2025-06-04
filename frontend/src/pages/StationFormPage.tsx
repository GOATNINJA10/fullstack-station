import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ChargingStation } from '../types';
import { createStation, getStationById, updateStation } from '../services/stationService';
import { MapPin, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

type StationFormData = {
  name: string;
  latitude: string;
  longitude: string;
  status: 'active' | 'inactive';
  powerOutput: string;
  connectorType: string;
};

const StationFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<StationFormData>();
  
  useEffect(() => {
    if (isEditMode) {
      fetchStation();
    }
  }, [id]);
  
  const fetchStation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const station = await getStationById(id!);
      
      // Transform data for the form
      reset({
        name: station.name,
        latitude: station.location.latitude.toString(),
        longitude: station.location.longitude.toString(),
        status: station.status,
        powerOutput: station.powerOutput.toString(),
        connectorType: station.connectorType
      });
    } catch (err) {
      setError('Failed to load charging station');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const onSubmit = async (data: StationFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Transform form data to match API structure
      const stationData: Partial<ChargingStation> = {
        name: data.name,
        location: {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude)
        },
        status: data.status,
        powerOutput: parseFloat(data.powerOutput),
        connectorType: data.connectorType
      };
      
      if (isEditMode) {
        await updateStation(id!, stationData);
        toast.success('Station updated successfully!');
      } else {
        await createStation(stationData);
        toast.success('New station added successfully!');
      }
      
      navigate('/');
    } catch (err) {
      const errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} charging station`;
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsSubmitting(false);
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
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
        >
          <ArrowLeft className="mr-1 h-5 w-5" />
          <span>Back</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Edit Charging Station' : 'Add New Charging Station'}
        </h1>
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
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              className={`w-full px-3 py-2 border ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Station Name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  id="latitude"
                  type="text"
                  className={`w-full pl-10 pr-3 py-2 border ${
                    errors.latitude ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Latitude (e.g., 40.7128)"
                  {...register('latitude', { 
                    required: 'Latitude is required',
                    pattern: {
                      value: /^-?\d+(\.\d+)?$/,
                      message: 'Invalid latitude format'
                    },
                    validate: {
                      range: value => {
                        const num = parseFloat(value);
                        return (num >= -90 && num <= 90) || 'Latitude must be between -90 and 90';
                      }
                    }
                  })}
                />
                {errors.latitude && (
                  <p className="mt-1 text-sm text-red-600">{errors.latitude.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  id="longitude"
                  type="text"
                  className={`w-full pl-10 pr-3 py-2 border ${
                    errors.longitude ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Longitude (e.g., -74.0060)"
                  {...register('longitude', { 
                    required: 'Longitude is required',
                    pattern: {
                      value: /^-?\d+(\.\d+)?$/,
                      message: 'Invalid longitude format'
                    },
                    validate: {
                      range: value => {
                        const num = parseFloat(value);
                        return (num >= -180 && num <= 180) || 'Longitude must be between -180 and 180';
                      }
                    }
                  })}
                />
                {errors.longitude && (
                  <p className="mt-1 text-sm text-red-600">{errors.longitude.message}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              className={`w-full px-3 py-2 border ${
                errors.status ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              {...register('status', { required: 'Status is required' })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="powerOutput" className="block text-sm font-medium text-gray-700 mb-1">
              Power Output (kW)
            </label>
            <input
              id="powerOutput"
              type="number"
              step="0.1"
              min="0"
              className={`w-full px-3 py-2 border ${
                errors.powerOutput ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Power Output (kW)"
              {...register('powerOutput', { 
                required: 'Power output is required',
                min: {
                  value: 0,
                  message: 'Power output must be greater than 0'
                }
              })}
            />
            {errors.powerOutput && (
              <p className="mt-1 text-sm text-red-600">{errors.powerOutput.message}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="connectorType" className="block text-sm font-medium text-gray-700 mb-1">
              Connector Type
            </label>
            <select
              id="connectorType"
              className={`w-full px-3 py-2 border ${
                errors.connectorType ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              {...register('connectorType', { required: 'Connector type is required' })}
            >
              <option value="">Select connector type</option>
              <option value="Type 1">Type 1</option>
              <option value="Type 2">Type 2</option>
              <option value="CCS">CCS</option>
              <option value="CHAdeMO">CHAdeMO</option>
              <option value="Tesla">Tesla</option>
            </select>
            {errors.connectorType && (
              <p className="mt-1 text-sm text-red-600">{errors.connectorType.message}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md text-white ${
                isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <span>{isEditMode ? 'Update' : 'Create'} Station</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StationFormPage;
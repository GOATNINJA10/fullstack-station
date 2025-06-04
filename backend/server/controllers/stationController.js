import { supabase } from '../utils/supabaseClient.js';

export const createStation = async (req, res) => {
  try {
    const { name, location, status, powerOutput, connectorType } = req.body;
    
    if (!name || !location || !status || !powerOutput || !connectorType) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'All fields are required'
      });
    }
    
    const { data: station, error } = await supabase
      .from('charging_stations')
      .insert([
        {
          name,
          location,
          status,
          power_output: powerOutput,
          connector_type: connectorType,
          created_by: req.user.id
        }
      ])
      .select();
      
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Error creating charging station'
      });
    }
    
    return res.status(201).json({
      success: true,
      data: {
        station: station[0]
      }
    });
  } catch (error) {
    console.error('Create station error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Error creating charging station'
    });
  }
};

export const getAllStations = async (req, res) => {
  try {
    const { status, connectorType, minPower, maxPower } = req.query;
    
    let query = supabase.from('charging_stations').select('*');
    
    // Apply filters if provided
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    if (connectorType) {
      query = query.eq('connector_type', connectorType);
    }
    
    if (minPower) {
      query = query.gte('power_output', minPower);
    }
    
    if (maxPower) {
      query = query.lte('power_output', maxPower);
    }
    
    const { data: stations, error } = await query;
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Error fetching charging stations'
      });
    }
    
    // Transform to match frontend model
    const transformedStations = stations.map(station => ({
      id: station.id,
      name: station.name,
      location: station.location,
      status: station.status,
      powerOutput: station.power_output,
      connectorType: station.connector_type,
      createdAt: station.created_at,
      updatedAt: station.updated_at
    }));
    
    return res.status(200).json({
      success: true,
      data: {
        stations: transformedStations
      }
    });
  } catch (error) {
    console.error('Get stations error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Error fetching charging stations'
    });
  }
};

export const getStationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: station, error } = await supabase
      .from('charging_stations')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Charging station not found'
        });
      }
      
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Error fetching charging station'
      });
    }
    
    // Transform to match frontend model
    const transformedStation = {
      id: station.id,
      name: station.name,
      location: station.location,
      status: station.status,
      powerOutput: station.power_output,
      connectorType: station.connector_type,
      createdAt: station.created_at,
      updatedAt: station.updated_at
    };
    
    return res.status(200).json({
      success: true,
      data: {
        station: transformedStation
      }
    });
  } catch (error) {
    console.error('Get station error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Error fetching charging station'
    });
  }
};

export const updateStation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, status, powerOutput, connectorType } = req.body;
    
    // Check if station exists
    const { data: existingStation } = await supabase
      .from('charging_stations')
      .select('*')
      .eq('id', id)
      .single();
      
    if (!existingStation) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Charging station not found'
      });
    }
    
    // Update station
    const { data: updatedStation, error } = await supabase
      .from('charging_stations')
      .update({
        name: name || existingStation.name,
        location: location || existingStation.location,
        status: status || existingStation.status,
        power_output: powerOutput || existingStation.power_output,
        connector_type: connectorType || existingStation.connector_type,
        updated_at: new Date()
      })
      .eq('id', id)
      .select();
      
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Error updating charging station'
      });
    }
    
    // Transform to match frontend model
    const transformedStation = {
      id: updatedStation[0].id,
      name: updatedStation[0].name,
      location: updatedStation[0].location,
      status: updatedStation[0].status,
      powerOutput: updatedStation[0].power_output,
      connectorType: updatedStation[0].connector_type,
      createdAt: updatedStation[0].created_at,
      updatedAt: updatedStation[0].updated_at
    };
    
    return res.status(200).json({
      success: true,
      data: {
        station: transformedStation
      }
    });
  } catch (error) {
    console.error('Update station error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Error updating charging station'
    });
  }
};

export const deleteStation = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if station exists
    const { data: existingStation } = await supabase
      .from('charging_stations')
      .select('*')
      .eq('id', id)
      .single();
      
    if (!existingStation) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Charging station not found'
      });
    }
    
    // Delete station
    const { error } = await supabase
      .from('charging_stations')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Error deleting charging station'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        message: 'Charging station deleted successfully'
      }
    });
  } catch (error) {
    console.error('Delete station error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Error deleting charging station'
    });
  }
};
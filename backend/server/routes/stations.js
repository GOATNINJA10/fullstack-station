import express from 'express';
import { 
  createStation, 
  getAllStations, 
  getStationById, 
  updateStation, 
  deleteStation 
} from '../controllers/stationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', createStation);
router.get('/', getAllStations);
router.get('/:id', getStationById);
router.put('/:id', updateStation);
router.delete('/:id', deleteStation);

export default router;
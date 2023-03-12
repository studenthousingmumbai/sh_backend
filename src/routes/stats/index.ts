import { Router } from 'express';

import availableBeds from './available-beds'; 
import studentsByListing from './students-by-listing';
import studentsInAppt from './students-in-appartment';
import studentsOnFloor from './students-on-floor'; 

const router = Router();

router.post('/available-beds', ...availableBeds);
router.post('/students-in-appartment', ...studentsInAppt); 
router.post('/students-on-floor', ...studentsOnFloor); 
router.post('/students-by-listing', ...studentsByListing); 

export default router;
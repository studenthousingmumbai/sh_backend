import { Router } from 'express';

import getListing from './get_id'; 
import getListings from './get';
import createListing from './post'; 
import updateListing from './patch_id'; 
import deleteListing from './delete_id';
import createFloor from './create_floor'; 
import createAppartment from './create_appartment';
import updateAppartment from './update_appartment'; 
import getBeds from './get_beds';
import searchListings from './search-listings';
import createBed from './create-bed';
import getBed from './get-bed'; 
import deleteBed from './delete-bed'; 
import updateBed from './update-bed'; 

const router = Router();

router.post('/', ...createListing);
router.patch('/', ...updateListing); 
router.get('/search-listings', ...searchListings); 
router.get('/:id', ...getListing); 
router.post("/all", ...getListings); 
router.delete('/:id', ...deleteListing);
router.post("/create-floor", ...createFloor);
router.post("/create-appartment", ...createAppartment);
router.patch('/update-appartment', ...updateAppartment); 
router.get('/get-beds/:id', ...getBeds); 
router.post("/beds/create", createBed); 
router.get("/beds/:id", ...getBed); 
router.delete('/beds/:id', ...deleteBed); 
router.patch('/beds/:id', ...updateBed); 

export default router;
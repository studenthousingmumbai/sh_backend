import { Router } from 'express';

import getOrder from './get_id'; 
import getOrders from './get';
import createOrder from './post_create'; 
import updateOrder from './patch_id'; 
import deleteOrder from './delete_id';
import searchOrder from './search'; 
import createSession from './create-payment-session'; 
import unlockBed from './unlock-bed';

const router = Router();

router.post('/', ...createOrder);
router.get('/search-orders', ...searchOrder);
router.patch('/:id', ...updateOrder); 
router.get('/:id', ...getOrder); 
router.post("/all", ...getOrders); 
router.delete('/:id', ...deleteOrder);
router.post('/create-session', ...createSession);
router.post('/unlock-bed', ...unlockBed);

export default router;
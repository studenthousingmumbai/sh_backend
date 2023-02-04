import { Router } from 'express';

import getOrder from './get_id'; 
import getOrders from './get';
import createOrder from './post_create'; 
import updateOrder from './patch_id'; 
import deleteOrder from './delete_id';

const router = Router();

router.post('/', ...createOrder);
router.patch('/:id', ...updateOrder); 
router.get('/:id', ...getOrder); 
router.post("/all", ...getOrders); 
router.delete('/:id', ...deleteOrder);

export default router;
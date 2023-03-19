import { Router } from 'express';

import getUser from './get_id'; 
import getUsers from './get_users';
import postUser from './post_signup'; 
import patchUser from './patch_id'; 
import deleteUser from './delete_id';
import loginRouter from './post_login'; 
import googleSignin from './post-google-signin'; 
import currentUser from './current-user'; 
import searchUsers from './search-users';
import searchAdmins from './search-admins';
import verifyAccount from './verify-account';
import forgotPassword from './forgot-password';
import verifyResetCode from './verify-reset-code';
import resetPassword from './reset-password';

const router = Router();

router.get('/verify/:verification_code', ...verifyAccount);
router.get('/current-user', ...currentUser);
router.patch('/', ...patchUser); 
router.get('/search-users', ...searchUsers);
router.get('/search-admins', ...searchAdmins);
router.get('/:id', ...getUser); 
router.post('/signup', ...postUser);
router.post('/login', loginRouter); 
router.post("/all", ...getUsers); 
router.delete('/:id', ...deleteUser);
router.post('/google-signin', ...googleSignin);
router.post('/forgot-password', ...forgotPassword);
router.post('/verify-reset-code', ...verifyResetCode);
router.post('/reset-password', ...resetPassword);

export default router;
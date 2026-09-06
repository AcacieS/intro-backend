import { Router } from 'express'
import { registerUser } from '../controllers/user.controller.js';

const router = Router();

//router is like example user, end
// .route more specific one like register, login, logoout
//.post attribute of this route
router.route('/register').post(registerUser);

export default router;
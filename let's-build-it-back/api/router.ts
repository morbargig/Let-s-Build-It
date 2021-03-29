import { Router } from 'express';
const router = Router();
import AuthRouter from './auth/auth.action'
import UsersRouter from './users/users'


router.use('/Account', AuthRouter)
router.use('users/', UsersRouter)

export default router;


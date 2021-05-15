import express from 'express';
import memberController from '../controllers/member';

const router = express.Router();

router.use('/v1', memberController);

export default router;
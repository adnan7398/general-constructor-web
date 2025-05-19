import express from 'express';
import { getAdmin } from '../controllers/adminController';

const app = express();
const router = express.Router();
// Route to get admin data  
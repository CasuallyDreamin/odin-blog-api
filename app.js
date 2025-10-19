import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import { PrismaClient } from '@prisma/client';

dotenv.config();

prisma
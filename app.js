import express from 'express';
import dotenv from 'dotenv';

import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';

import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({ message: "sintopia api is up and running!"});
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error"});
});

// Start Server
const PORT = process.env.PORT || 5000;
const SERVER_URL = process.env.SERVER_URL || "http//localhost"
app.listen(PORT, () => console.log(`Server running on ${SERVER_URL}:${PORT}`));
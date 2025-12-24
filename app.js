import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import postViewRoutes from './routes/postViewRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';
import archiveRoutes from './routes/archiveRoutes.js';
import authroutes from './routes/authRoutes.js';
import messageRoutes from './routes/contactRoutes.js';

import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
}));
app.use(cookieParser());
// Routes
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/medias", mediaRoutes);
app.use("/api/postViews", postViewRoutes);
app.use("/api/settings",settingsRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/archives", archiveRoutes);
app.use("/api/auth", authroutes);
app.use("/api/contact", messageRoutes);
// Health check
app.get("/", (req, res) => {
    res.json({ message: "sintopia api is up and running!"});
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error"});
});

export default app;
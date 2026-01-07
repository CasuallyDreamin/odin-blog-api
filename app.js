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
import statsRoutes from './routes/statsRoutes.js';
import cors from "cors";

dotenv.config();

const app = express();

const appName = process.env.APP_NAME || "API";
const whitelist = process.env.CORS_WHITELIST ? process.env.CORS_WHITELIST.split(',') : [];

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/$/, "");

    console.log("CORS origin:", origin);

    if (whitelist.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
}));

app.use(cookieParser());

app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/postViews", postViewRoutes);
app.use("/api/settings",settingsRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/archives", archiveRoutes);
app.use("/api/auth", authroutes);
app.use("/api/contact", messageRoutes);
app.use("/api/stats", statsRoutes);

app.get("/api/", (req, res) => {
    res.json({ 
        message: `${appName} api is up and running!`, 
        online: true 
    });
});

app.get("/", (req, res) => {
    res.json({ 
        message: `${appName} server is up and running!`, 
        online: true 
    });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error"});
});

export default app;
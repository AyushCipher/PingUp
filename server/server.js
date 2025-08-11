import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { inngest, functions } from './inngest/index.js';
import { serve } from 'inngest/express';
import { clerkMiddleware } from '@clerk/express'
import userRouter from './routes/userRoutes.js';

const app = express();

// Connect to DB
await connectDB();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());



// Test route
app.get('/', (req, res) => {
    res.send("Server is running");
});

// Inngest route
app.use('/api/inngest', serve({ client: inngest, functions }));
app.use('/api/user', userRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

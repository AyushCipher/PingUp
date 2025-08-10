import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { inngest, functions } from './inngest/index.js';
import { serve } from 'inngest/express';

const app = express();

// Connect to DB
await connectDB();

app.use(express.json());
app.use(cors());

// Test route
app.get('/', (req, res) => {
    res.send("Server is running");
});

// Inngest route
app.use('/api/inngest', serve({ client: inngest, functions }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

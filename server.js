import app from './app.js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
app.use(express.json()); 


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
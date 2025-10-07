import express from 'express';
import routes from './src/routes/index.js';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/api', routes);

export default app;
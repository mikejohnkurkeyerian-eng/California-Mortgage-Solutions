import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
const port = process.env.PORT ?? 4005;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (_req, res) => {
  res.json({status: 'ok', service: 'rules-service'});
});

app.listen(port, () => {
  console.log(`rules-service listening on port ${port}`);
});

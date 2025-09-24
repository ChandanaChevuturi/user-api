import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { json } from 'express';
import { usersRouter } from './routes/users.js';
import { errorHandler } from './middlewares/error.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';

const app = express();
app.use(cors());
app.use(json());

// ✅ Root route
app.get('/', (_req, res) => {
  res.send('🚀 User API is running! Visit <a href="/docs">/docs</a> for Swagger docs.');
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/users', usersRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);
export default app;

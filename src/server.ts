import app from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${env.PORT}`);
  console.log(`📘 API docs at     http://localhost:${env.PORT}/docs`);
});

import { Hono } from 'hono';
import list from './routes/list';
import { cognitoAuth } from './middleware/auth';
import upload from './routes/upload';

const app = new Hono();

app.use('/api/*', cognitoAuth);
app.route('/api/list', list);
app.route('/api/upload', upload);

export default app;

import 'dotenv/config';
import connectDB from './src/config/db';
import waitlist from './src/router/waitlist.router';
import express, { Application } from 'express';
import type { Response, Request } from 'express';
import admin from './src/router/admin.router';
import cookieParser from 'cookie-parser';

const PORT = 3000;
const app: Application = express();

app.use(express.json());
app.use(cookieParser());

app.use('/users', waitlist);
app.use('/admin', admin);

app.get('/', (req: Request, res: Response) => {
   res.status(201).json({
      message: 'API is working',
   });
});

connectDB()
   .then(() => {
      app.listen(3000, () => {
         console.log('Server running on port 3000');
      });
   })
   .catch((error) => {
      console.error('Failed to connect to database', error);
      process.exit(1);
   });

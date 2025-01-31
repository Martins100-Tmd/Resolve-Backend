import "dotenv/config"; 
import connectDB from "./src/config/db";
import express, { Application, Express } from "express";
import waitlist from "./src/router/waitlist.router";
import admin from "./src/router/admin.router"
import cookieParser from "cookie-parser";

 const PORT = 3000
const app: Application = express();

app.use(express.json())
app.use(cookieParser())

app.use('/users', waitlist)
app.use('/admin', admin)

app.get('/', (req: any, res: any) => {
     res.status(201).json({
        message: "API is working"
     })
})

connectDB().then(() => {
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
}).catch(error => {
    console.error('Failed to connect to database', error);
    process.exit(1);
});
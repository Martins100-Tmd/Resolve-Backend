import "dotenv/config"; 
import connectDB from "./src/config/db";
import express, { Application, Express } from "express";
import waitlist from "./src/router/waitlist.router";
 const PORT = 3000
const app: Application = express();

app.use(express.json())

app.use('/users', waitlist)

app.use('/', (req: any, res: any) => {
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
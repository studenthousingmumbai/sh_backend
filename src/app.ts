import 'express-async-errors';
import express, { Request, Response } from 'express';
import cors from 'cors';
import configureRoutes from './routes';

const app = express();

// register mandatory middleware 
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(function (req, response, next) {
    response.contentType('application/xml');
    next();
});
app.get('/', (req:Request, res: Response) => { 
    res.send("all good");
});

configureRoutes(app);

export { app };
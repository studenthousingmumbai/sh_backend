import { Express, Request, Response } from 'express';

import { BadRequestError } from '../errors';
import { errorHandler } from '../middleware';

// import api routers here 

const registerResourceRoutes = (app: Express) => { 
    // make app.use calls here eg - app.use("/user", userRouter); 
};

const registerErrorHandlers = (app: Express) =>  {
    // handler for any route that does not exist
    app.use("*", (req: Request, res: Response) => { 
        throw new BadRequestError("Route not found!");
    });
    
    // error handler for errors thrown in any route 
    app.use(errorHandler);
}

const configureRoutes = (app: Express) => { 
    registerResourceRoutes(app);
    registerErrorHandlers(app);
};

export default configureRoutes;
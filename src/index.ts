import mongoose from 'mongoose';
import { app } from './app';
import config from './config';

(async () => { 
    console.log("starting server...");

    try{    
        await mongoose.connect(config.DB_URI);
        console.log('Connected to database successfully!');
    }
    catch(err){
        console.log(err);
    }
    
    app.listen(config.PORT, () => { 
        console.log(`Server listening on PORT: ${config.PORT}`);
    });
})();
import mongoose from 'mongoose';
// import Job from '../models/job'; 
import Listing from '../models/listings';
import Bed from '../models/beds';
import Order from '../models/orders';
import Appartment from '../models/appartment';
import User from '../models/users';

const local_db = 'mongodb+srv://Tanay:test12345@mern-app.o5cvu.mongodb.net/booking?retryWrites=true&w=majority';
const sh_dev_db = 'mongodb+srv://sh_admin:i7VCr4ve$tb$3d6@cluster0.hzov4yv.mongodb.net/sh_data_dev?retryWrites=true&w=majority';

async function cleanDB(){ 
    await Listing.deleteMany({}); 
    await Bed.deleteMany({}); 
    await Order.deleteMany({}); 
    await Appartment.deleteMany({}); 
    await User.deleteMany({});
}

(async () => { 
    try{    
        await mongoose.connect(local_db);
        console.log('Connected to database successfully!');

        await cleanDB();
        console.log("Database cleaned!"); 

        process.exit();
    }
    catch(err){
        console.log(err);
    }
})();
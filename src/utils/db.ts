import mongoose from 'mongoose';
// import Job from '../models/job'; 
import Listing from '../models/listings';


async function deleteAllListings(){ 
    await Listing.deleteMany({}); 
    console.log("Deleted all listings"); 
}

(async () => { 
    try{    
        await mongoose.connect('mongodb+srv://Tanay:test12345@mern-app.o5cvu.mongodb.net/booking?retryWrites=true&w=majority');
        console.log('Connected to database successfully!');

        await deleteAllListings();
        process.exit();
    }
    catch(err){
        console.log(err);
    }
})();
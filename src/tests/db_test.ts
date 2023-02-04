import mongoose from 'mongoose';
import config from '../config';

import User from '../models/users';
import Listing from '../models/listings';
import Order from '../models/orders';

async function testUser(){
    // create user 
    const new_user = new User({ 
        role: "customer", 
        access: "", 
        
    })
}

async function testOrder(){ 

}   

async function testListing(){ 

}

(async () => { 
    console.log("starting server...");

    try{    
        await mongoose.connect(config.DB_URI);
        await testUser();
        await testOrder(); 
        await testListing();



        console.log('Connected to database successfully!');
    }
    catch(err){
        console.log(err);
    }
})();
import { Request, Response } from 'express';
import { body } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import { validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import Listing from '../../models/listings';
import { uploaded_files } from '../../utils/aws-s3';
import { s3_upload } from '../../utils/aws-s3';
import { getCoordinates } from '../../utils/google-maps';

// const validation_rules = [
//     body('email').exists().withMessage("email must be supplied").notEmpty().withMessage('email cannot be blank').isEmail().withMessage('email must be valid'),
//     body('password').exists().withMessage("password must be supplied").notEmpty().withMessage('password cannot be blank').trim().isLength({ min: 8, max: 16}).withMessage("password must be minimum 8 and maximum 16 characters long"),
// ];

const cpUpload = uploaded_files.fields([
    { name: 'floor_plan', maxCount: 1 }, 
    { name: 'images', maxCount: 8 },
    { name: 'amenities_images', maxCount: 100 } 
]); 

const middleware: any = [
    // auth middleware here 
    cpUpload, 
    // ...validation_rules,
    // validateRequest
];

export default [
    ...middleware, 
    async (req: Request, res: Response) => { 
        // extract data from request body
        let { 
            name, 
            description, 
            amenities, 
            address, 
            price, 
            gender,
        } = req.body;

        const images = [];
        const listing_image_files: any = req.files && "images" in req.files && req.files['images'] || null; 
        const existing_listing = await Listing.findOne({ name }); 
        
        if(existing_listing) { 
            throw new BadRequestError(`Listing with name: ${name} already exists`);
        }

        if (amenities && typeof amenities === "string") {
            amenities = JSON.parse(amenities); 
        }

        // Use address to find lat long 
        const address_obj = JSON.parse(address)
        const full_address = address_obj.line_1 + ", " + address_obj.line_2 + ", " + address_obj.city + ", "  +  address_obj.state + ", " + address_obj.zip;
        const location = await getCoordinates(full_address); 

        if(Object.keys(location).length === 0) {
            throw new BadRequestError("Geocoding failed! Please enter a valid address.");
        }

        // construct listing object and save to db 
        const new_listing = new Listing({
            name, 
            description, 
            address: address_obj, 
            price, 
            gender, 
            amenities, 
            location
        });
        await new_listing.save(); 

        if(listing_image_files && listing_image_files.length > 0) { 
            // upload listing images to s3 & get s3 urls 
            // @ts-ignore
            for(let i=0; i < listing_image_files.length; i++) {
                const image_file = listing_image_files[i]; 
                const original_name = image_file.originalname; 
                const file_extension = original_name.split('.')[1]; 

                // upload image to s3 
                try{ 
                    const s3_response: any  = await s3_upload(image_file.buffer, `listings/${new_listing._id}/property/image_${uuidv4()}.${file_extension}`); 
                    console.log(s3_response); 

                    if(s3_response) { 
                        images.push(s3_response.Location); 
                    }
                }
                catch(err){ 
                    console.log(err); 
                }
            }

            new_listing.set({ images }); 
            await new_listing.save(); 
        }
        
        // res.status(201).send({ listing: new_listing });
        res.status(201).json(new_listing);
    }
]; 
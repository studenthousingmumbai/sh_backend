import { Request, Response } from 'express';
import { body } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

import { validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import Listing from '../../models/listings';
import { uploaded_files } from '../../utils/aws-s3';
import { s3_upload } from '../../utils/aws-s3';
import { getCoordinates } from '../../utils/google-maps';

const validation_rules = [
    body('id').exists().withMessage("id must be supplied").notEmpty().withMessage('id cannot be blank'),
];

const cpUpload = uploaded_files.fields([
    { name: 'images', maxCount: 8 }
]); 

const middleware: any = [
    // auth middleware here 
    cpUpload
    // ...validation_rules,
    // validateRequest
];

export default [
    ...middleware, 
    async (req: Request, res: Response) => { 
        let { id, amenities, existing_images, address } = req.body;
        const listing_image_files: any = req.files && "images" in req.files && req.files['images'] || null; 
        const new_images = []; 
        const listing: any = await Listing.findById(id);

        // check if a user with the supplied email exists 
        if (!listing) {
            throw new BadRequestError("Listing not found");
        }   

        if(existing_images){ 
            // parse the json string since existing images will be passed in as a list of url strings
            existing_images = JSON.parse(existing_images); 
            listing.set({ images: [...existing_images]});
            await listing.save(); 
        }

        if(listing_image_files && listing_image_files.length > 0) { 
            // upload listing images to s3 & get s3 urls 
            // @ts-ignore
            for(let i=0; i < listing_image_files.length; i++) {
                const image_file = listing_image_files[i]; 
                const original_name = image_file.originalname; 
                const file_extension = original_name.split('.')[1]; 

                // upload image to s3 
                try{ 
                    const s3_response: any  = await s3_upload(image_file.buffer, `listings/${listing._id}/property/image_${uuidv4()}.${file_extension}`); 
                    console.log(s3_response); 

                    if(s3_response) { 
                        new_images.push(s3_response.Location); 
                    }
                }
                catch(err){ 
                    console.log(err); 
                }
            }

            listing.set({ images: [...listing.images!, ...new_images] }); 
            await listing.save();  
        }

        // find which images need to be deleted by comparing req.body.existing_images and listing.images
        // delete removed files from s3 here 
        delete req.body.id; 

        if(req.body.address){ 
            // Use address to find lat long 
            const address_obj = JSON.parse(address)
            const full_address = address_obj.line_1 + ", " + address_obj.line_2 + ", " + address_obj.city + ", "  +  address_obj.state + ", " + address_obj.zip;
            const location = await getCoordinates(full_address); 

            if(Object.keys(location).length === 0) {
                throw new BadRequestError("Geocoding failed! Please enter a valid address.");
            }

            listing.set({ 
                address: address_obj,
                location 
            }); 

            delete req.body.address; 
        }

        if(req.body.amenities) { 
            listing.set({  
                amenities: JSON.parse(amenities) 
            }); 

            delete req.body.amenities
        }

        listing.set({  
            ...req.body, 
        });

        await listing.save();

        res.status(201).send(listing);
    }
];
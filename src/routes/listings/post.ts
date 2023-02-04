import { Request, Response } from 'express';
import { body } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

import { validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import { generateAccessToken } from '../../utils/auth';
import Listing from '../../models/listings';
import { Password } from '../../utils/password';
import { uploaded_files } from '../../utils/aws-s3';
import { s3_upload } from '../../utils/aws-s3';

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
        const amenities_images = []; 

        // @ts-ignore
        const listing_image_files: any = req.files && "images" in req.files && req.files['images'] || null; 
        // @ts-ignore
        // const amenities_image_files: any = req.files['amenities_images'] || null; 
        // @ts-ignore
        // const floor_plan_image_file: any = req.files['floor_plan'] &&  req.files['floor_plan'][0] || null; 

        // console.log("images: ", listing_image_files); 
        // console.log("amenities: ", amenities_image_files); 
        // console.log("floor_plan: ", floor_plan_image_file); 

        // check if another listing with the same name does not exist  
        const existing_listing = await Listing.findOne({ name }); 
        
        if(existing_listing) { 
            throw new BadRequestError(`Listing with name: ${name} already exists`);
        }

        amenities = JSON.parse(amenities); 
        console.log("amenities: ", amenities); 
        
        // TODOD - use address to find lat long 

        // construct listing object and save to db 
        const new_listing = new Listing({
            name, 
            description, 
            address, 
            price, 
            gender, 
            amenities
        });
        await new_listing.save(); 

        if(listing_image_files && listing_image_files.length > 0) { 
            // upload listing images to s3 & get s3 urls 
            // @ts-ignore
            for(let i=0; i < listing_image_files.length; i++) {
                console.log(i); 

                const image_file = listing_image_files[i]; 
                const original_name = image_file.originalname; 
                const file_extension = original_name.split('.')[1]; 

                console.log("Original file name: ", original_name); 
                console.log("File extension: ", file_extension); 

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
        
        // if(floor_plan_image_file){ 
        //     try { 
        //         // upload floor_plan image to s3 & get s3 urls 
        //         const s3_response: any  = await s3_upload(floor_plan_image_file.buffer, `listings/${new_listing._id}/floor_plan`); 
        //         console.log(s3_response); 

        //         new_listing.set({ floor_plan: s3_response.Location });

        //         await new_listing.save(); 
        //     }
        //     catch(err) { 
        //        console.log(err); 
        //     }
        // }   

        // if(amenities_image_files){
        //     // upload amenities images to s3 & get s3 urls 
        //     // @ts-ignore
        //     for(let i=0; i < amenities_image_files.length; i++) {
        //         const image_file = amenities_image_files[i]; 
        //         const original_name = image_file.originalname; 
        //         const file_extension = original_name.split('.')[1]; 

        //         console.log("Original file name: ", original_name); 
        //         console.log("File extension: ", file_extension); 

        //         // upload image to s3 
        //         try{ 
        //             const s3_response: any  = await s3_upload(image_file.buffer, `/listings/${new_listing._id}/amenities/image_${i}`); 
        //             console.log(s3_response); 

        //             if(s3_response) { 
        //                 amenities_images.push(s3_response.Location); 
        //             }
        //         }
        //         catch(err){ 
        //             console.log(err); 
        //         }
        //     }

        //     for(let i=0; i < amenities.length; i++) { 
        //         let total_images = amenities[i].total_images;
        //         let start,end; 

        //         if(i === 0){
        //             start = 0;
        //             end = total_images;
        //         } else { 
        //             start = amenities[i - 1].total_images; 
        //             end = start + total_images;  
        //         }

        //         console.log(amenities_images.slice(start,end)); 
        //         amenities[i].images = amenities_images.slice(start,end);
        //     }
        
        //     new_listing.set({ amenities }); 
        //     await new_listing.save(); 
        // }

        // res.status(201).send({ listing: new_listing });
        res.status(201).json(new_listing);
    }
]
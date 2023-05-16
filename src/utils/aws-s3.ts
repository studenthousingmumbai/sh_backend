import AWS from 'aws-sdk'; 
import config from '../config';
import multer from 'multer'; 
import { BadRequestError } from '../errors';

const S3_BUCKET = config.S3_BUCKET_NAME;
const REGION = config.AWS_REGION;
const ACCESS_KEY = config.AWS_ACCESS_KEY;
const SECRET_ACCESS_KEY = config.AWS_SECRET_KEY;

AWS.config.update({ region: REGION });

const s3 = new AWS.S3({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
});

// const s3_upload = (file) => {
//     const params = {
//         Bucket: S3_BUCKET,
//         Key: config.AWS.S3.folder[config.ENV] + file.originalname,
//         Body: file.buffer,
//     };

//     return new Promise((res, rej) => {
//         s3.upload(params, function (err, data) {
//             if (err) {
//                 return rej(err);
//             }

//             res(data);
//         });
//     })
// }


// file must be a buffer 
export const s3_upload = (file_data: Buffer, file_name: string) => {
    console.log(S3_BUCKET); 

    const params: any = {
        Bucket: S3_BUCKET,
        Key: file_name,
        Body: file_data,
    };

    return new Promise((res, rej) => {
        s3.upload(params, (err: any, data: any) =>  {
            if (err) {
                return rej(err);
            }

            res(data);
        });
    })
}

export const s3_download = (s3_key: string) => { 
    const params: any = { 
        Bucket: S3_BUCKET, 
        Key: s3_key
    };
    
    return new Promise((res, rej) => { 
        s3.getObject(params, function(err: any, data: any) {
            if (err) {
                return rej(err);
            } 

            res(data);
            
            /*
            data = {
                AcceptRanges: "bytes", 
                ContentLength: 3191, 
                ContentType: "image/jpeg", 
                ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"", 
                LastModified: <Date Representation>, 
                Metadata: {
                }, 
                TagCount: 2, 
                VersionId: "null"
            }
            */
        });
    });
};


const storage = multer.memoryStorage();

const whitelist = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
]; 

// use to instantiate the middleware
export const uploaded_files = multer({ 
    storage: storage, 
    fileFilter: (req, file, cb) => {
        if (whitelist.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new BadRequestError('Only .png, .jpg/.jpeg and .webp format allowed!'));
        }
    }
});
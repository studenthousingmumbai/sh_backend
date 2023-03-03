"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploaded_files = exports.s3_download = exports.s3_upload = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_1 = __importDefault(require("../config"));
const multer_1 = __importDefault(require("multer"));
const errors_1 = require("../errors");
const S3_BUCKET = config_1.default.S3_BUCKET_NAME;
const REGION = config_1.default.AWS_REGION;
const ACCESS_KEY = config_1.default.AWS_ACCESS_KEY;
const SECRET_ACCESS_KEY = config_1.default.AWS_SECRET_KEY;
aws_sdk_1.default.config.update({ region: REGION });
const s3 = new aws_sdk_1.default.S3({
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
const s3_upload = (file_data, file_name) => {
    console.log(S3_BUCKET);
    const params = {
        Bucket: S3_BUCKET,
        Key: file_name,
        Body: file_data,
    };
    return new Promise((res, rej) => {
        s3.upload(params, (err, data) => {
            if (err) {
                return rej(err);
            }
            res(data);
        });
    });
};
exports.s3_upload = s3_upload;
const s3_download = (s3_key) => {
    const params = {
        Bucket: S3_BUCKET,
        Key: s3_key
    };
    return new Promise((res, rej) => {
        s3.getObject(params, function (err, data) {
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
exports.s3_download = s3_download;
const storage = multer_1.default.memoryStorage();
const whitelist = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
];
// use to instantiate the middleware
exports.uploaded_files = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype === 'image/webp') {
            cb(null, true);
        }
        else {
            cb(null, false);
            return cb(new errors_1.BadRequestError('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

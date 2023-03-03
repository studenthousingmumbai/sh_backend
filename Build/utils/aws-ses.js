"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const AWS = require("aws-sdk");
const config_1 = __importDefault(require("../config"));
const REGION = config_1.default.AWS_REGION;
const ACCESS_KEY = config_1.default.AWS_ACCESS_KEY;
const SECRET_ACCESS_KEY = config_1.default.AWS_SECRET_KEY;
function sendEmail(to, subject, body) {
    return __awaiter(this, void 0, void 0, function* () {
        // Configure AWS SES
        AWS.config.update({
            region: REGION,
            accessKeyId: ACCESS_KEY,
            secretAccessKey: SECRET_ACCESS_KEY
        });
        // Create SES service object
        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        // Build the email parameters
        const params = {
            Destination: {
                ToAddresses: [to]
            },
            Message: {
                Body: {
                    Text: {
                        Charset: "UTF-8",
                        Data: body
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: subject
                }
            },
            Source: "sender@example.com"
        };
        // Send the email
        try {
            const data = yield ses.sendEmail(params).promise();
            console.log("Email sent: ", data);
        }
        catch (err) {
            console.log(err, err.stack);
        }
    });
}
exports.sendEmail = sendEmail;

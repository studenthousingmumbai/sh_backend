import AWS = require('aws-sdk');
import config from '../config';

const REGION = config.AWS_REGION;
const ACCESS_KEY = config.AWS_ACCESS_KEY;
const SECRET_ACCESS_KEY = config.AWS_SECRET_KEY;

export async function sendEmail(to: string, from: string, subject: string, body: string) {
    // Configure AWS SES
    AWS.config.update({
        region: REGION,
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY
    });

    // Create SES service object
    const ses = new AWS.SES({apiVersion: '2010-12-01'});

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
        Source: from
    };

    // Send the email
    try {
        const data = await ses.sendEmail(params).promise();
        console.log("Email sent: ", data);
    } catch (err: any) {
        console.log(err, err.stack);
    }
}
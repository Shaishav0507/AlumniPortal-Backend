const nodeMailer = require('nodemailer');
const sendgridTransoprt = require('nodemailer-sendgrid-transport');

const sendMailFunction = mailObject => {
    const transporter = nodeMailer.createTransport(sendgridTransoprt({
        auth: {
            api_key: process.env.SENDGRID_API_KEY
        }
    }));

    transporter.sendMail(mailObject);
};

module.exports = {
    sendMailer: sendMailFunction
}
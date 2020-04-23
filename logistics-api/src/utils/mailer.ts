import nodemailer from 'nodemailer';
import config from '../utils/config';

const transporter = nodemailer.createTransport({
    host: config.mailer.options.service,
    port: 587,
    secure: false,
    auth: {
        user: config.mailer.options.auth.user,
        pass: config.mailer.options.auth.pass
    }
});

exports.sendInvoiceMail = async function(to: any) {
    try{
        const info = await transporter.sendMail({
            from: config.mailer.from,
            to,
            subject: "Confirm your invoice",
            text: "Confirm your invoice",
            html: '<b>Confirm your invoice</b>'
        });
        console.log(info);
        return info;
    } catch(e){
        throw e;
    }
}

exports.ok = function() {
    console.log("here");
}

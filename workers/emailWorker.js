'use strict';
const nodemailer = require('nodemailer');



process.on('message', (msg) => {
    if (msg.cmd == 'registerEmail') {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: account.user, // generated ethereal user
                    pass: account.pass // generated ethereal password
                }
            });

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Fred Foo 👻" <foo@example.com>', // sender address
                to: 'bar@example.com, baz@example.com', // list of receivers
                subject: `Welcome to Study Maps ${msg.username}`, // Subject line
                text: `Welcome to the study maps website ${msg.username}. You have registered using this email. We hope you enjoy our service.`, // plain text body
                html: `Welcome to the study maps website <b> ${msg.username}</b>. You have registered using <b>this email</b>.<h1> We hope you enjoy our service.</h1>` // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
        });
        process.send("email sent");
    }
    console.log('Mail worker got message:', msg);
});


console.log("Email worker started");
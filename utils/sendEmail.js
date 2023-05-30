const Mailgen = require("mailgen");
const nodemailer = require("nodemailer");
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {

    let config = {
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    };

    let transporter = nodemailer.createTransport(config);
    let MailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: `Forgot Password`,
            link: options.data.reset_url,
        },
    });

    let response = {
        body: {
            name: options.email,
            intro: `You have requested a password reset. Please click the link below to reset your password.`,
            action: {
                instructions: 'Click the button to reset your password:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Reset password',
                    link: options.data.reset_url
                }
            },
            outro: 'If you did not request a password reset, no further actions are required.'
        },
    };

    let mail = MailGenerator.generate(response);

    const msg = {
        to: options.email, // Change to your recipient
        from: process.env.EMAIL, // Change to your verified sender
        subject: `Password Reset Request`,
        html: mail,
    }

    try {
        transporter
            .sendMail(msg)
            .then(() => {
                return res.status(201).json({
                    msg: "you should receive an email",
                });
            })
            .catch((error) => {
                return res.status(500).json({ error });
            });
    } catch (error) {
        console.error(error)

        if (error.response) {
            console.error(error.response.body)
        }
    }
};
const sendEmailConfirm = async (options) => {
    let config = {
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    };

    let transporter = nodemailer.createTransport(config);
    let MailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Email Confirmation",
            link: options.data.confirm_url,
        },
    });

    let response = {
        body: {
            name: options.email,
            intro: "You are receiving this email because you need to confirm your email address.",
            action: {
                instructions: "Please click the button below to confirm your email address:",
                button: {
                    color: "#22BC66",
                    text: "Confirm Email",
                    link: options.data.confirm_url,
                },
            },
            outro: "If you did not request this email, no further action is required.",
        },
    };

    let mail = MailGenerator.generate(response);

    const msg = {
        to: options.email,
        from: process.env.EMAIL,
        subject: "Email Confirmation",
        html: mail,
    };

    try {
        await transporter.sendMail(msg);
    } catch (error) {
        console.error(error);
        throw new Error("Failed to send confirmation email");
    }
};

module.exports = { sendEmail, sendEmailConfirm };

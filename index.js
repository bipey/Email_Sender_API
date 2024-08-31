import express from "express";
import nodemailer from "nodemailer";
import 'dotenv/config';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sendEmail = async (receiver, sub, msg) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,  
        secure:false,// defaulting to 587 if EMAIL_PORT is not defined
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: receiver,
        subject: sub,
        text: msg,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return true;  // Indicate success
    } catch (error) {
        console.error('Error occurred:', error);
        return false;  // Indicate failure
    }
};

app.get('/', (req, res) => {
    console.log(process.env.EMAIL);
    res.send("The Server started");
});

app.post('/', async (req, res) => {
    const { receiver, sub, msg } = req.body;
    console.log(receiver,sub,msg)
    if (!receiver || !sub || !msg) {
        return res.status(400).send("Missing required fields: receiver, sub, or msg");
    }
    try {
        const mailSent = await sendEmail(receiver, sub, msg);
        if (!mailSent) {
            res.status(500).send("An error occurred while sending the email");
        } else {
            res.send("Mail sent successfully");
        }
    } catch (error) {
        res.status(500).send(`Error occurred: ${error.message}`);
    }
});

app.listen(8000, () => {
    console.log("Server started at 8000");
});

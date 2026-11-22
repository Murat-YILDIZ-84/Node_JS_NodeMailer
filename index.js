require('dotenv').config();

const express = require("express");
const cors = require('cors');
const app = express();
const nodemailer = require("nodemailer");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH");
    next();
});

async function sendGmail() {
    var result = "";
    var _date;

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
            tls: { rejectUnauthorized: false },
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: `"Gönderen Adı" <${process.env.GMAIL_USER}>`,
            to: "yildizmur@itu.edu.tr",
            subject: "Node.js ile Test E-postası",
            text: "Bu e-posta Node.js ve Nodemailer ile gönderildi.",
            html: "<b>Bu e-posta Node.js ve Nodemailer ile gönderildi.</b>",
        });

        _date = new Date().toLocaleString("sv");
        result = "[" + _date + "] Email Sent (" + info.messageId + ")";
    } catch (error) {
        _date = new Date().toLocaleString("sv");
        result = "[" + _date + "] Error has occured";
    }

    return result;
}

app.get("/test", (req, res) => {
    const _date = new Date().toLocaleString("sv");

    res.writeHead(200, {'Content-Type': 'text/json'});
    res.write("[" + _date + "] Ok");
    res.end();
})

app.get("/sendEmail", async (req, res) => {
    var _date = new Date().toLocaleString("sv");

    res.writeHead(200, {'Content-Type': 'text/json'});
    res.write("[" + _date + "] Sending Email");

    var result = await sendGmail();

    res.write("\r\n" + result);
    res.end();
})

app.listen(5000, () => console.log('Server is running on port 5000'));
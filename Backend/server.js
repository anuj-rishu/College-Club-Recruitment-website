const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {});

// User schema and model
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    rollNumber: String,
    phoneNumber: String,
    email: String,
});

const User = mongoose.model('User', userSchema);

// Admin schema and model
const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const Admin = mongoose.model('Admin', adminSchema);

// Register user and send confirmation email
app.post('/register', async (req, res) => {
    const { firstName, lastName, rollNumber, phoneNumber, email } = req.body;
    const newUser = new User({ firstName, lastName, rollNumber, phoneNumber, email });
    await newUser.save();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        },
    });

        const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Registration Confirmation',
        html: `
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                    }
                    .container {
                        padding: 20px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        max-width: 600px;
                        margin: auto;
                    }
                    .header {
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 20px;
                    }
                    .content {
                        font-size: 16px;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 14px;
                        color: #555;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">Registration Confirmation</div>
                    <div class="content">
                        <p>Hi ${firstName},</p>
                        <p>Thank you for registering! We are excited to have you on board.</p>
                        <p>If you have any questions, feel free to reply to this email.</p>
                    </div>
                    <div class="footer">
                        <p>Best regards,</p>
                        <p>Your Company Name</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });

    res.json({ message: 'User registered successfully and confirmation email sent!' });
});

// Get all users
app.get('/users', async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully!' });
});

// Update user information
app.put('/users/:id', async (req, res) => {
    const { firstName, lastName, rollNumber, phoneNumber, email } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, rollNumber, phoneNumber, email },
            { new: true }
        );
        res.json({ message: 'User updated successfully!', updatedUser });
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error });
    }
});

// Create admin credentials
app.post('/create-admin', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();
    res.json({ message: 'Admin credentials created!' });
});

// Admin login
app.post('/admin-login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin || !await bcrypt.compare(password, admin.password)) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ id: admin._id }, 'secret-key', { expiresIn: '1h' });
    res.json({ token });
});

// Middleware to check JWT token
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access Denied' });
  jwt.verify(token, 'secret-key', (err, user) => {
  
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Admin routes (protected)
app.get('/admin/users', authenticateJWT, async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

app.delete('/admin/users/:id', authenticateJWT, async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully!' });
});

app.put('/admin/users/:id', authenticateJWT, async (req, res) => {
    const { firstName, lastName, rollNumber, phoneNumber, email } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, rollNumber, phoneNumber, email },
            { new: true }
        );
        res.json({ message: 'User updated successfully!', updatedUser });
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

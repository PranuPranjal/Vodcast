const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/usersDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define a User schema
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

const userSchema1 = new mongoose.Schema({
    token: String,
});

// Create a User model
const User = mongoose.model('User', userSchema);

const Link = mongoose.model('Link', userSchema1);

// Signup Route
let info;
app.post('/signup', async (req, res) => {
    const { name, email, password, cnfpassword } = req.body;
    
    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).send('Email already in use');
        }

        if (password !== cnfpassword) {
            return res.status(401).send('Please recheck the password');
        }

        if (password.length < 8) {
            return res.status(401).send('Password must contain at least 8 characters');
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(200).send('Welcome!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating user');
    }
});

// Signin Route
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    info = email;
    try {
        const user = await User.findOne({ email, password });

        if (user) {
            res.status(200).send('Welcome!');
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error signing in');
    }
});

// Message Route
app.get('/message', (req, res) => {
    // Implement a way to return messages, this can be session-based
    res.send(info);
});

// Create Route (For whatever logic was intended for 'create')
app.get('/create', async (req, res) => {
    const meetid = await Link.findOne(); 
    // await StringModel.deleteOne({ _id: meetid._id });
    console.log(meetid);
    // Add logic to interact with MongoDB or other data
    res.send(meetid.token);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

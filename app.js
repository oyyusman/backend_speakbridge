const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());
// const bcrypt=require("")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoUrl = "mongodb+srv://usmansirsyedian:U.sman12@cluster0.rbczckk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const JWT_SECRET = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxMTMxMzk5NywiaWF0IjoxNzExMzEzOTk3fQ.yrRI71bRB5c30kV_xtVZMrvNf64_akoirtZ2icEeGCQ"

mongoose.connect(mongoUrl).then(() => {
    console.log('Connected to the database');
}
).catch((error) => {
    console.log({ status: 'error', data: error });
})
require('./Userdetails');
const User = mongoose.model('UserDetails');
app.get('/', (req, res) => {
    res.send('Hello World');

})
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const olduser = await User.findOne({ email: email });
    if (olduser) {
        return res.send({ data: 'Email is already in use' });
    }
    const encryptedpassword = await bcrypt.hash(password, 12);
    try {
        await User.create({
            name: name,
            email: email,
            password: encryptedpassword
        });
        res.send({ status: 'ok', data: "User created" });
    }
    catch (error) {
        res.send({ status: 'error', data: error });

    }
}

)

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const olduser = await User.findOne({ email: email });
    if (!olduser) {
        return res.send({ status: 'error', error: 'Invalid Email' });
    }
    if (await bcrypt.compare(password, olduser.password)) {
        const token = jwt.sign({ email: olduser.email }, JWT_SECRET);
        if (res.status(201)) {
            return res.send({ status: 'ok', data: token });
        }
        else {
            return res.send({ error: "error" })
        }
    }
    else {
        res.send({ status: 'error', error: 'Invalid Password' });
    }

})
app.post("/userdata", async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SECRET);
        const userdata = user.email
        User.findOne({ email: userdata }).then(data => {

            return res.send({ status: 'ok', data: data });
        })
    } catch (error) {
        return res.send({ error: error })

    }

})
app.post("/forget-password", async (req, res) => {
    const { email } = req.body;
    try {
        const olduser = await User.findOne({ email });
        if (!olduser) {
            return res.send({ status: "user does not exist" });
        }
        const secret = JWT_SECRET + olduser.password;
        const token = jwt.sign({ email: olduser.email, id: olduser._id }, secret, { expiresIn: "5m" });


        const link = `http://localhost:3000/reset-password/${olduser._id}/${token}`;
        console.log(link);

    } catch (error) {
        res.send({ status: 'error', error: error });
    }


})

app.get("/reset-password", async (req, res) => {
    const { token, id } = req.params;
    console.log(req.params)



})

app.post('/update-user', async (req, res) => {
    const { name, email, image } = req.body;
    try {
        await User.updateOne({ email: email }, {
            $set: {
                name: name,
                image: image,

            }
        })
        res.send({ status: 'ok', data: 'user updated' })


    } catch (error) {
        res.send({ status: 'error', error: error })

    }


})
app.listen(3000, () => {
    console.log('Server is running on port 3000');
}
);
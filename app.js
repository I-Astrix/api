const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());
const dotenv = require('dotenv').config()
let cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST"]
}));

const connectTodb = require('./config/db');

connectTodb();


app.use('/api/auth', require('./routes/auth'));
app.use('/api/post', require('./routes/post'));

app.get('/', (req, res)=>{
    res.send('Routes Working')
})



app.listen(5000, ()=>{
    console.log('Connection to the Server was successful');
})
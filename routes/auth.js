const { route } = require('express/lib/router');
const mongoose = require('mongoose');
const router = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
const { body, validationResult } = require('express-validator');


const User = require('../models/User');

const JWT_SECRET = 'alongsecurestringfromjwtsecret';




router.post('/register',[
    body('email').isEmail(),
    body('password').isLength({min: 8}),
    body('firstName').isLength({min: 3}),
], async(req, res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors});
    }

            try{
            const user = await User.findOne({email: req.body.email});
            if(user){
                res.status(400).send('User with same email already exists')
            }
            else{
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(req.body.password, salt);
                const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    image: req.body.image,
                    username: req.body.username,
                    email: req.body.email,
                    isAdmin: req.body.isAdmin,
                    password: hashedPassword
                })                
                const saveUser = await newUser.save();            
                res.status(200).json(newUser)
            }
        }
        catch(err){
            res.status(400).json(err)
        }
    })

    router.post('/login', async(req, res)=>{
            try{
                const user = await User.findOne({email: req.body.email});
                if(!user){
                    res.status(400).json("Invalid Credentials")
                }
                else{
                    const checkPass = await bcrypt.compare(req.body.password, user.password, (err, success)=>{
                        if(success){
                            const authToken = jwt.sign(
                                {id: user._id}, JWT_SECRET, { expiresIn: '1h' });

                            const {password, ...others} = user._doc;

                            res.cookie("blogify_access", authToken, {
                                httpOnly: true,
                                sameSite: 'None',
                                secure: true
                                }).status(200).json({...others})
                        }
                        else{
                            res.status(400).json(err)
                        }    
                    });                 
                }
            }
            catch(err){
                res.status(400).json(err)
            }
    })


    // Working No Issues Found
    router.post('/updateUsername', verifyToken, async(req, res)=>{
        
        if(req.body.userId !== req.user.id){
            res.status(400).json("You can only Change your username")
            
        }
        try{
            const usernameChange = await User.findByIdAndUpdate(req.user.id, {username: req.body.newUsername})
            .then(success => res.status(200).json('Successfully Updated Username'))
            .catch(err=>res.status(400).json({err}));
        }
        catch(err){
            res.status(400).json(err)
        }
        
    })

    // Working and No issues found
    router.post('/updateName', verifyToken, async(req, res)=>{
        if(req.body.userId !== req.user.id){
            res.status(400).json("You can only Change your Name")
        }
        try{  
            const usernameChange = await User.findByIdAndUpdate(req.user.id, {firstName: req.body.newfirstName, lastName: req.body.newlastname})
            .then(success => res.status(200).json('Successfully Updated Name'))
            .catch(err=>res.status(400).json({err}));
        }
        catch(err){
            res.status(400).json({err});
        }
        
    })


    // Working No Issues Found
    
    router.post('/updateEmail', verifyToken, async(req, res)=>{
        
        if(req.body.userId !== req.user.id){
            res.status(400).json("You can only Change your Email")
        }
        try{
            const user = await User.findById(req.user.id);
            const passwordCompare = await bcrypt.compare(req.body.password, user.password)
            if(passwordCompare){
                const updateEmail = await User.findByIdAndUpdate(req.user.id, {email: req.body.newEmail}).then(success=> res.status(200).json("Successfully Updated Email")).catch(err=> res.status(400).json("Error Changing Email"))
            }
        }
        catch(err){
            res.status(400).json(err)
        }
        
    })

    router.get('/test', (req, res)=>{
        const cookie = req.cookies.blogify_access;
        console.log(cookie);
        if(!cookie){
            console.log('No Cookie Found')
        }
        else{
            console.log(cookie)
        }
        // res.clearCookie('blogify_access');
        res.send("Request Received")
    })

    router.get('/userInfo', verifyToken, async(req, res)=>{
        try{
            const userInfo = await User.findById(req.user.id).select('-password');
            res.status(200).json(userInfo);
        }
        catch(err){
            res.status(400).json(err);      
        }
    })


    router.post('/logout', (req,res)=>{
        try{
            res.clearCookie('blogify_access')
            res.status(200).json({success: true})
        }   
        catch{
            res.status(200).json({success: false})
        }
    })

module.exports = router;

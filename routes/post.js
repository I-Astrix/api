const mongoose = require('mongoose');
const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const Post = require('../models/Post');

const User = require('../models/User');
const Cat = require('../models/Category');


// ------******-------------
// Only for testing purposes x
// ------******-------------

// router.get('/', verifyToken, (req, res)=>{
//     const token = req.user.id
//     res.send(token)
// })

router.post('/cat/new',  async(req, res)=>{
    const newCat = new Cat({
        name: req.body.name
    });
    try{
        const checkExistance = await Cat.findOne({name: req.body.name});
        if(checkExistance){
            res.status(401).json({error: 'Cat Already Exists'})
        }
        else{
            const saveCat = await newCat.save();
            res.status(200).json({success: true})
        }
    }
    catch(err){
        res.status(400).json({err, success: false})
    }
})

router.get('/cat/findAll', async(req, res)=>{
        try{
            const cats = await Cat.find();
            res.status(200).json(cats)
        }
        catch(err){
            res.status(400).json({err, success: false})
        }
})


router.post('/newPost', verifyToken, async(req, res)=>{

    const {title, displayText, categories, tags, content} = req.body;

    const idForUser = req.user.id;

    const newPost = new Post({
            userId: idForUser,
            userDetails: idForUser,
            title: title,
            displayText: displayText,
            categories: categories,
            tags: tags,
            content: content
        })

    try{
        const savePost = await newPost.save();
        res.status(200).json(savePost)   
    }
    catch(err){
        res.status(400).json(err)
    }
    
})

router.get('/postByUser/:userId', async(req, res)=>{
    const user = req.params.userId;
    console.log(user);
    try{
        const posts = await Post.find({userId: user}).populate("userDetails", ["firstName", "lastName", "email", "image"]).exec();
        res.status(200).json(posts)
    }
    catch{
        res.status(400).json("An Error Occurred")
    }
})

router.get('/find/:id', async(req, res)=>{
    const reqId = req.params.id;
    try{
        const post = await Post.findById(reqId).populate("userDetails", ["firstName", "lastName", "email", "image"]).exec();
        res.status(200).json(post)
    }
    catch(err){
        res.status(400).json('Error')
    }    
})

router.post('/delete/:id', verifyToken, async(req, res)=>{

    const reqId = req.params.id;
    
    if(req.body.userId !== req.user.id){
        res.status(400).json("Get Outta Here, You are not allowed to do that")
    }
    try{
        const deletePost = await Post.deleteOne({ _id: reqId }, function (err) {
            if (err) return handleError(err);
            res.status(200).json("Successfully Deleted The Post");
          });
    }
    catch(err){
        res.status(400).json("Error Deleting The Post");
    }
    
})

router.post('/update/:id', verifyToken, async(req, res)=>{

    if(req.body.userId !== req.user.id){
        res.status(400).json("Get Outta Here, You are not allowed to do that")
    }

    try{
        const updatePost = await Post.findByIdAndUpdate(req.user.id, {$set: req.body})
        .then(success => res.status(200).json('Successfully Updated Username'))
        .catch(err=>res.status(400).json({err}));   
    }
    catch(err){
        res.status(400).json(err)
    }
    
})

router.get('/all', async (req, res)=>{
    try{
        const posts = await Post.find({});
        res.status(200).json(posts)
    }catch(err){
        res.status(400).json('Error Fetching Posts')
    }

})

// Get By User
router.get('/byUsername', async(req, res)=>{

    const username = req.query.username;

    try{
        const userPosts = await Post.find({username: username});
        res.status(200).json(userPosts);
    }
    catch(err){
        res.status(400).json(err);
    }
});


router.post('/bookmarks', async(req, res)=>{


    const posts = [req.body];

    try{
        const bookmarks = await Post.find().where("_id").in(posts[0].bstate).populate("userDetails", ["firstName", "lastName", "email", "image"]).exec((err, posts)=>{
            if(!err){
                res.status(200).json(posts)
            }
        })
    }
    catch(err){
        res.status(400).json(err)
    }
})

// Pagination

router.get('/posts/findAll', async(req, res)=>{
    let { page = 1, size = 20 } = req.query
    page = parseInt(page)
    size = parseInt(size)
    const query = {};

    // Counts the Documents in DB
    const totalData = await Post.find().estimatedDocumentCount()
    // Fetching Posts
    const data = await Post.find(query).skip((page - 1) * size).limit(size).populate("userDetails", ["firstName", "lastName", "email", "image"]).exec()


    const pageNumber = Math.ceil(totalData / size)
    const results = {
        currentPage: page,
        prevPage: page <= 1 ? null : page - 1,
        nextPage: page >= pageNumber ? null : page + 1,
        length: data.length,
        data
    }
    res.json(results);
})

router.get('/test',verifyToken, (req, res)=>{   
    res.status(200).json({user: req.user.id})
})


module.exports = router;
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'alongsecurestringfromjwtsecret';



module.exports = function verifyToken(req, res, next){
    // const token = req.header('auth-token');
    const token = req.cookies.blogify_access;
    console.log(token)
    if(!token){
        return res.status(400).json({error: "Not Authenticated"});
    }
    else{
        jwt.verify(token, JWT_SECRET, (err, user)=>{
            if(!err){
                req.user = user;
                next();      
            }
        })
    }
}


// module.exports = function verifyToken(req, res, next){
//     // const token = req.header('auth-token');
//     const token = req.cookies.blogify_access;
//     console.log(token)
//     if(!token){
//         return res.status(400).json('Not Authenticated')
//     }
//     try{
//         const data = jwt.verify(token, JWT_SECRET, (err, user)=>{
//             if(!err){
//                 req.user = user;
//                 next();      
//             }
//         })
//     }
//     catch{
//         res.status(401).json("Invalid Token")
//     }
// }












// function verifyAdmin(req, res, next){
//     verifyToken(req, res, ()=>{
//         if(req.body.userId === req.user.id || req.user.isAdmin){
//             next()
//         }
//         else{
//             res.status(400).json("You're not allowed to do that")
//         }
//     })

// }



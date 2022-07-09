const mongoose = require('mongoose');



module.exports = function connectTodb(){
    try{
        mongoose.connect(process.env.MONGO_URI, ()=>{
            console.log("Connected To DB Successfully")
        })
    }
    catch(err){
        return err
    }
}
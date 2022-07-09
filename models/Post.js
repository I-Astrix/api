const mongoose = require('mongoose');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// const PostSchema = new mongoose.Schema({
//     userId: {
//         type: String,
//         required: true
//     },
//     userName: {
//         type: String,
//         required: true
//     },
//     title:{
//         type: String,
//         required: true
//     },
//     content: {    
//         type: String,
//         required: true
//     },
//     views:{
//         type: Number,
//         required: true
//     },
//     categories:{
//         type: Array,
//         required: true   
//     }
    
// }, {timestamps: true});

const Schema = mongoose.Schema;


const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    userDetails: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    displayText:{
        type: String,
        required: true
    },
    categories: {
        type: Array,
        required: true
    },
    tags:{
        type: Array
    },
    content: {    
        type: String,
        required: true
    },
    sanitizedContent:{
        type: String,
        required: true
    }
    
}, {timestamps: true});

PostSchema.pre('validate', function(next){
    if(this.content){
        this.sanitizedContent = DOMPurify.sanitize(this.content)
    }
    next()
})

module.exports = mongoose.model('Post', PostSchema);
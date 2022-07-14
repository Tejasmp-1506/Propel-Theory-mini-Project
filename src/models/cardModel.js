const mongoose = require("mongoose");


const cardSchema = new mongoose.Schema({
    personName: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    designation: {
        type: String,
        trim: true
    },
    companyName: {
        type: String,
        trim: true,
        required: true
    },
    contactNo : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    emailAddress : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    websiteURL: {
        type: String,
        trim: true,
        required: true
    },
    socialURLs: {
        type: Array,
        required: true
        
    },
    companyLogo: {
        type: String,
        require: true
    },
    isDeleted:{
        default:false
    }


}, { timestamps: true });

module.exports = mongoose.model("cardDetails", cardSchema)
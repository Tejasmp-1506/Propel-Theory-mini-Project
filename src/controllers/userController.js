const userModel = require("../models/userModel")
const validator = require("../validations/validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const createUser = async function(req, res){
    try{
       
        const userDetails = req.body
        const {firstName, lastName, contactNo, emailAddress, password} = userDetails
        if(!(firstName || lastName || contactNo || emailAddress || password)){
            return res.status(400).send({status : false, msg : "Please provide all required details"})
        }

        if(!validator.isValid(firstName || lastName || contactNo || emailAddress || password)){
            return res.status(400).send({status : false , msg : "Please fill all the blanks carefully"})
        }

        if (!validator.isValidName(firstName)) {
            return res.status(400).send({ status: false, msg: "please provide valid first name" });
        }

        if (!validator.isValidName(lastName)) {
            return res.status(400).send({ status: false, msg: "please provide valid last name" });
        }

        if (!validator.isValidNumber(contactNo)) {
            return res.status(400).send({ status: false, msg: "please provide valid phone number" });
        }
      
        if (!validator.isValidEmail(emailAddress)) {
            return res.status(400).send({ status: false, msg: "please provide valid email id" });
        }

        if (!validator.isValidPassword(password)) {
            return res.status(400).send({status: false, msg: "please provide strong and valid password including eg. 'A-Z , a-z , 0-9 , @'",});
        }

        const duplicatePhone = await userModel.findOne({ contactNo: contactNo });

        if (duplicatePhone) {
            return res.status(400).send({status: false,msg: "phone no already exist. Please provide another phone no" });
        }

        const duplicateEmail = await userModel.findOne({ ememailAddress: emailAddress });
    
        if (duplicateEmail) {
            return res.status(400).send({status: false,msg: "email id already exist. Please provide another email id",});
        }

        const encryptPassword = await bcrypt.hash(password, 10);

        const finalDetails = {firstName, lastName, contactNo, emailAddress, password : encryptPassword}

        const savedDetails = await userModel.create(finalDetails);

        return res.status(201).send({status : true, msg : "User created successfully" , data : savedDetails})
    }
    catch(error){
        return res.status(500).send({status : false, msg : error.message})
    }
}



const loginUser = async function(req, res){
    try{
        const loginDetails = req.body

        if(!loginDetails){
          return res.status(400).send({status : false , msg : "Please provide login details"})
        }

        const {emailAddress , password} = loginDetails

        if(!(emailAddress || password)){
          return res.status(400).send({status : true , msg : "Please provide email and password"})
        }

        if(!validator.isValid(emailAddress || password)){
            return res.status(400).send({status : false , msg : "Please fill the blanks carefully"})
        }

        if (emailAddress && password) {
            let userDetails = await userModel.findOne({ emailAddress });
            if (!userDetails) {
              return res.status(400).send({ status: false, msg: "user does not exist" });
            }

            let verifiedPass = await bcrypt.compare(password, userDetails.password);
            if(verifiedPass){
                let payload = {_id : userDetails._id};
                let token = jwt.sign(payload, "MySercetKey", {expiresIn : "300m"});
                return res.status(200).send({status : true , msg : "User login successfully" , data : token})
            }
            else{
                return res.status(400).send({status : false, msg : "Invalid password"})
            }
        }
    }
    catch(error){
        res.status(500).send({status : false, msg : error.message})
    }
}





module.exports = {createUser , loginUser }
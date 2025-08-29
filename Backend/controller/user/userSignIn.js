const bcrypt = require('bcrypt');
const userModel = require("../../models/usermodel");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userSignInControler = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            throw new Error("please provide email")
        }
        if (!password) {
            throw new Error("please provide password")
        }

        const existingUser  = await userModel.findOne({ email });

        if (!existingUser ) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: true
            })
        }

        const checkPassword =await bcrypt.compare(password, existingUser.password);

        console.log("checkPassword", checkPassword);

          if (!checkPassword) {
          
            return res.status(401).json({
                message: "Invalid password",
                success: false,
                error: true
            });
        }

        
            const tokenData = {
                _id: existingUser._id,
                email: existingUser.email
            }
            const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: "12h"});
            res.cookie("token", token, {
                httpOnly: true,       
                secure: true,        
                sameSite: "None",
                maxAge: 12 * 60*60*1000 
            });
            res.status(200).json({
                message: "Login successfully",
                data: token,
                success: true,
                error: false,
            });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message || "Something went wrong",
            error: true,
            success: false
        });
    }


}

module.exports = userSignInControler;
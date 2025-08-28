const mongoose = require('mongoose');

const connectDB = async () => {
    try{
         await mongoose.connect(process.env.MONGOBD_URL);
        
    }catch(err){

    }
}

module.exports = connectDB;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aaaSchema = new Schema({
  
    firstName: String,
    lastName: String,
    dob:String,
    email: String,
    phoneNum:String

});

const AAA = mongoose.model('aaas', aaaSchema);
module.exports = AAA;
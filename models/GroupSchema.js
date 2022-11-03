const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    members:{
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('GROUP',groupSchema);

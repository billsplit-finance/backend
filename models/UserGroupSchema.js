const mongoose = require("mongoose");

const userGroupSchema = new mongoose.Schema({
    uid:{
        type: String,
        required: true
    },
    group:{
        type: Array,
        required: true
    },
    cardtotal:{
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('USERGROUP',userGroupSchema);

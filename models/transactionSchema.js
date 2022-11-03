const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    gid:{
        type: String,
        required: true
    },
    transactions:[
        {
            fromTo:{
                type: Array,
                required: true
            },
            amount:{
                type: Number,
                required: true
            },
            description:{
                type: String,
                required: true
            },
            label:{
                type: String,
                required: true
            },
            date:{
                type: String,
                reuired: true
            }
        }
    ],
    showAmount:{
        type: Array,
        required:true
    },
    simplified:{
        type: Array,
        required:true
    }
    
});

module.exports = mongoose.model('TRANSACTION',transactionSchema);

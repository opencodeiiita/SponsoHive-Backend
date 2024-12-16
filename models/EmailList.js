const mongoose = require("mongoose");


const EmailListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contacts: [
        {
        name: String,
        email: String
        }
    ],
    tags: {
        type: [String],
        default: []
    }
});

const EmailList = new mongoose.model("EmailList", EmailListSchema);

module.exports = EmailList;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    content: String,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Message", messageSchema);
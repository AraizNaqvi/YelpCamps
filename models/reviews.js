let mongoose = require('mongoose');

let reviewSchema = new mongoose.Schema({
    body: String,
    rating: Number,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
});
module.exports = mongoose.model('review', reviewSchema);
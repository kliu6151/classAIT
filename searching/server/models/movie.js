var mongoose = require('mongoose')
    , Schema = mongoose.Schema


var movieSchema = new Schema ({
    title: String,
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0}
})

movieSchema
.virtual('url')
.get(function () {
    return '/post/movie' + this._id; 
});

module.exports = mongoose.model('Movie', movieSchema);
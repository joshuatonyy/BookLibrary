const mongoose = require('mongoose');
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

authorSchema.pre('remove', function(next) {
    Book.find({ author: this.id }, (err, books) => {
        if (err) {
            next(err)
        } else if (books.length > 0) { //if there are book regs with author
            next(new Error('This author is registered with books'))
        } else {
            next()
        }
    })
})

module.exports = mongoose.model('Author', authorSchema);
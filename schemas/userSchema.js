const mongoose = require('mongoose')

const userSchema = mongoose.Schema ({
    id: {type: mongoose.Schema.Types.ObjectId},
    firstName: {type: String, require: [true, 'Please enter your first name.']},
    lastName: {type: String, require: [true, 'Please enter your last name.']},
    email: {type: String, require: [true, 'Please enter your email address.'], unique: true},
    password: {type: String, require: [true, 'Please enter a password.']}
})

module.exports = mongoose.model("users", userSchema)
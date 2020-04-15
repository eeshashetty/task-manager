const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Invalid email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            if (value === "password") {
                throw new Error('password cannot be password')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error('Age is not real')
            }
        }
    }
})

userSchema.pre('save', async function (next) {
    const user = this
    
    console.log(user['password'].isModified())

    if (user.isModified['password']) {
        user.password = await bcrypt.hash(user.password, 8)
        console.log('modified!')
    }

})

const User = mongoose.model('User', userSchema)

module.exports = User

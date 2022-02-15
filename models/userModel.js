const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: false,
        default: ""
    },
    lastname: {
        type: String,
        required: false,
        default: ""
    },
    address: {
        street: {type: String,
                required: false 
                },
        house_no: {type: String,
                required: false 
                },
        zip_code: {type: String,
                required: false 
                },
        city: {type: String,
                required: false 
                },
        country: {type: String,
                required: false 
                }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    telephone: { 
        type: String, 
        required: false
    },
    mobile: {
        type: String, 
        required: false
    },
    resume: {
        type: String,
        required: false,
        default: null
    },
    applications: [{
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'Application',
            default: null
    }]
}, {
    timestamps: true
})

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

module.exports = User
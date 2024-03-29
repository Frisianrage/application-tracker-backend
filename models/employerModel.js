const mongoose = require('mongoose')

const employerSchema = mongoose.Schema({
    companyname: {
        type: String,
        required: true,
        default: ""
    },
    location: {
        address: {type: String,
                required: false 
                },
        addressTwo: {type: String,
                required: false 
                },
        zip_code: {type: String,
                required: false 
                },
        city: {type: String,
                required: false 
                },
        state: {type: String,
                required: false 
                },
        country: {type: String,
                required: false 
                }
    },
    email: {
        type: String,
        required: false
    },
    telephone: { 
        type: String, 
        required: false
    },
    mobile: {
        type: String, 
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Application',
        default: null
    }],
    applicationCount: {
            type: Number,
            required: false,
            default: 0
    }
}, {
    timestamps: true
})

const Employer = mongoose.model('Employer', employerSchema)

module.exports = Employer

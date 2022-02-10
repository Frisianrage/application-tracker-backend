const mongoose = require('mongoose')

const employerSchema = mongoose.Schema({
    companyname: {
        type: String,
        required: true,
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
        required: false
    },
    telephone: { 
        type: String, 
        required: false
    },
    mobile: {
        type: String, 
        required: false
    }
}, {
    timestamps: true
})

const Employer = mongoose.model('Employer', employerSchema)

module.exports = Employer

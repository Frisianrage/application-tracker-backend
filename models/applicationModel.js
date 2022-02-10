const mongoose = require('mongoose')

const applicationSchema = mongoose.Schema({
    jobtitle: {
        type: String,
        required: true,
        default: ""
    },
    jobdescription: {
        type: String,
        required: false,
        default: ""
    },
    salary: {
        type: String,
        required: false,
        default: ""
    },
    remote: {
        type: Boolean,
        required: true,
        default: false
    },
    location: {
        city: {
                type: String,
                required: false 
                },
        state: {
                type: String,
                required: false 
                },
        country: {
                type: String,
                required: false 
                }
    },
    Employer: {
        Employer: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Employer',
            default: null 
                },
        contactperson: {
            name:   {type: String,
                    required: false 
                    },
            email:  {type: String,
                    required: false 
                    },
            phone:  {type: String,
                    required: false 
                    }
        },
    },
    coverletter: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'File',
        default: null
    },
    status: {
        type: String,
        required: true,
        default: "Open"
    },
    source: {
        type: String,
        required: false,
        default: ""
    },
}, {
    timestamps: true
})

const Application = mongoose.model('Application', applicationSchema)

module.exports = Application
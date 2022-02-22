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
        default: "N/A"
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
    company: {
        employer: {
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
        name: {
            type: String,
            required: false,
            default: ""
        },
        content: {
            type: String,
            required: false,
            default: ""
        },
        date: {
            type: String,
            required: false,
            default: ""
        }
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
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
})

const Application = mongoose.model('Application', applicationSchema)

module.exports = Application
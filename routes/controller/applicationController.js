const Application = require('../../models/applicationModel')
const User = require('../../models/userModel')
const asyncHandler = require('express-async-handler')

// @desc    Create new application
// @route   POST /api/applications
// @access  Private

const createNewApplication = asyncHandler( async (req, res) => {
    const {jobtitle, jobdescription, salary, remote, location: {city, state, country}, employer: {employer, contactperson: {name, email, phone}}, coverletter, status, source} = req.body
    
    const application = await Application.create({
        jobtitle, 
        jobdescription, 
        salary, 
        remote, 
        location: {
            city,
            state,
            country
        }, 
        employer: {
            employer,
            contactperson: {
                name,
                email,
                phone
            }
        }, 
        coverletter, 
        status, 
        source,
        applicant: req.user._id
    })

    const user = await User.findById(req.user._id)

    if(application && user) {

        user.applications.push(application)
        await user.save()

        res.status(200).json({
            id: application._id,
            jobtitle: application.jobtitle,
            jobdescription: application.jobdescription,
            status: application.status,
            createdAt: application.createdAt,
            updatedAt: application.updatedAt
        })
    } else {
        res.status(400)
        throw new Error('Invalid application data!')
    }
})

// @desc    Get all my applications 
// @route   GET /api/applications/summary
// @access  Private

const getAllMyApplications = asyncHandler(async (req, res) => {
    const applications = await Application.find({user: req.user._id})
    
    if(applications) {
        res.json({applications})
    } else {
        res.status(404)
        throw new Error('No applications found!')
    }
})

// @desc    Get single application 
// @route   GET /api/applications/:id
// @access  Private

const getApplicationById = asyncHandler(async(req, res) => {
    const application = await Application.findById(req.params.id)

    if(application) {
        res.json(application)
    } else {
        res.status(404)
        throw new Error('Application not found')
    }
})
// @desc    Update application general
// @route   PUT /api/applications/:id
// @access  Private

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private

// @desc    Delete application 
// @route   PUT /api/applications/:id
// @access  Private /Admin

const deleteApplication = asyncHandler(async (req, res) => {
    const application = await Application.findById(req.params.id)
    const user = await User.findById(req.user._id)

    if(application && user) {
        //deleting the application from the user profile
        user.applications = user.applications.filter(app => app != req.params.id)
        await user.save()

        //deleteing the actual application
        await application.remove()

        res.json({message: 'Application successfully removed'})
    } else {
        res.status(404)
        throw new Error('Application not found!')
    }
})

module.exports = {createNewApplication, getAllMyApplications, getApplicationById, deleteApplication}
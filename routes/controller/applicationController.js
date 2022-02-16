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

const updateApplication = asyncHandler(async (req, res) => {
    const {jobtitle, jobdescription, salary, remote, location: {city, state, country}, employer: {employer, contactperson: {name, email, phone}}, coverletter, status, source} = req.body
    const application = await Application.findById(req.params.id)

    if(application) {
        application.jobtitle = jobtitle || application.jobtitle, 
        application.jobdescription = jobdescription || application.jobdescription, 
        application.salary = salary || application.salary, 
        application.remote = remote || application.remote, 
        application.location.city = city || application.location.city,
        application.location.state = state || application.location.state,
        application.location.country = country || application.location.country
        application.employer.employer = employer || application.employer.employer,
        application.contactperson.name = name || application.contactperson.name,
        application.contactperson.email = email || application.contactperson.email,
        application.contactperson.phone = phone || application.contactperson.phone,
        application.coverletter = coverletter || application.coverletter, 
        application.status = status || application.status, 
        application.source = source || application.source

        const updatedApplication = await application.save()

        res.json(updatedApplication)
      
    } else {
        res.status(404)
        throw new Error('Application not found!')
    }      
})

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private

const statusUpdate = asyncHandler(async (req, res) => {
    const {status} = req.body
    const application = await Application.findById(req.params.id)

    if(application) {
        application.status = status

        const updatedApplication = await application.save()

        res.json(updatedApplication)
    } else {
        res.status(404)
        throw new Error('Application not found')
    }
})

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

// @desc    add new coverletter
// @route   PUT /api/applications/:id/coverletter
// @access  Private

const addNewCoverletter = asyncHandler( async (req, res) => {
    const application = await Application.findById(req.params.id)
   
    if(application) {
        application.coverletter = req.body.coverletter

        const updatedApplication = application.save()

        res.json(updatedApplication)
    } else {
        res.status(400)
        throw new Error('Invalid file data!')
    } 
})

module.exports = {createNewApplication, getAllMyApplications, getApplicationById, deleteApplication, updateApplication, statusUpdate, addNewCoverletter}
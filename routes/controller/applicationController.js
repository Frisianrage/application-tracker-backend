const Application = require('../../models/applicationModel')
const User = require('../../models/userModel')
const Employer = require('../../models/employerModel')
const asyncHandler = require('express-async-handler')


// @desc    Create new application
// @route   POST /api/applications
// @access  Private

const createNewApplication = asyncHandler( async (req, res) => {
    const {jobtitle, jobdescription, salary, remote, location: {city, state, country}, company: {employer, contactperson: {name, email, phone}}, coverletter, status, source} = req.body
    
    //creates the new application and saves it in the database
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
        company: {
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

    if(application) {
        //finds the user and adds the application to the profile
        const updatedUser = await User.findOneAndUpdate({_id: req.user._id},{$push: {applications: application._id}, $inc: {applicationCount: 1} })
        
        //finds the employer and adds the application to the profile
        const updatedEmployer = await Employer.findOneAndUpdate({_id: employer},{$push: {applications: application._id}, $inc: {applicationCount: 1}})
        
        
        if(updatedUser && updatedEmployer){
            res.status(200).json({
                id: application._id,
                jobtitle: application.jobtitle,
                jobdescription: application.jobdescription,
                status: application.status,
                createdAt: application.createdAt,
                updatedAt: application.updatedAt
            })
        }
    } else {
        res.status(400)
        throw new Error('Invalid application data!')
    }
})


// @desc    Get all my applications 
// @route   GET /api/applications/summary
// @access  Private

const getAllMyApplications = asyncHandler( async (req, res) => {
    
    try {
        const user = await User.findById(req.user._id)
        .select('-password')
        .populate("applications")
        .populate( { path: 'applications', populate: { path: 'company', populate: 'employer' }, options: {sort : {createdAt: 'desc'}} })

        if(user) {
            res.json({
                userid: user._id,
                firstname: user.firstname,
                isAdmin: user.isAdmin,
                applications: user.applications
            })
        } else {
            res.status(404)
            throw new Error('User not found!')
        }
    } catch (error) {
        res.status(400)
        throw new Error('Invalid request!')
    }
})


// @desc    Get single application 
// @route   GET /api/applications/:id
// @access  Private

const getApplicationById = asyncHandler( async (req, res) => {
    //finds the application by id and returns it including the company that was applied to
    const application = await Application.findById(req.params.id).populate( { path: 'company', populate: 'employer' })
    
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

const updateApplication = asyncHandler( async (req, res) => {
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
        //application.coverletter = coverletter || application.coverletter, 
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

const statusUpdate = asyncHandler( async (req, res) => {
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
// @access  Private

const deleteApplication = asyncHandler( async (req, res) => {
    const application = await Application.findById(req.params.id)
    const user = await User.findById(req.user._id)
    const employer = await Employer.find(req.params.employerid)

    if(application && user && employer) {
        //deleting the application from the user profile
        user.applications = user.applications.filter(app => app != req.params.id)
        user.applicationCount -= 1
        await user.save()

        //deleting the application from the employer profile
        employer.applications = employer.applications.filter(app => app != req.params.id)
        employer.applicationCount -= 1
        await employer.save()

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
        application.coverletter.content = req.body.base64
        application.coverletter.date = Date.now()
        application.coverletter.name = req.body.name
        application.coverletter.type = req.body.type

        const updatedApplication = application.save()

        res.json(updatedApplication)
    } else {
        res.status(400)
        throw new Error('Invalid file data!')
    } 
})

// @desc    get all applications
// @route   PUT /api/applications/admin/applicationslist
// @access  Private / Admin

const getAllApplications = asyncHandler( async (req, res) => {
    const applications = await Application.find().populate('applicant').populate( { path: 'company', populate:'employer' })
    
    if(applications) {
        res.json(applications)
    } else {
        res.status(400)
        throw new Error('No applications found!!')
    } 
})

// @desc    get most recent applications
// @route   GET /api/applications/recent
// @access  Private

const getRecentApplications = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    .populate({path: 'applications', options: {sort: {createdAt: 'desc'}, limit: 5}, populate: { path: 'company', populate:'employer' }})
    
    if(user) {
        res.json(user)
    } else {
        res.status(400)
        throw new Error('No user found!!')
    }
})

// @desc    last changed application
// @route   GET /api/applications/lastchanged
// @access  Private

const getLastChangedApplication = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    .populate({path: 'applications', options: {sort: {updatedAt: 'desc'}, limit: 1}, populate: { path: 'company', populate:'employer' }})
    
    if(user) {
        res.json(user)
    } else {
        res.status(400)
        throw new Error('No user found!!')
    }
})

module.exports = {
    createNewApplication, 
    getAllMyApplications, 
    getApplicationById, 
    deleteApplication, 
    updateApplication, 
    statusUpdate, 
    addNewCoverletter, 
    getAllApplications,
    getRecentApplications,
    getLastChangedApplication
}
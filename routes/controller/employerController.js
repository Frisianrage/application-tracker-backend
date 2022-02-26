const Employer = require('../../models/employerModel')
const User = require('../../models/userModel')
const asyncHandler = require('express-async-handler')


// @desc    Create new employer
// @route   POST /api/employers
// @access  Private

const createNewEmployer = asyncHandler( async (req, res) => {
    const { companyname } = req.body
   
    const employerExisted = await Employer.findOne({companyname, user: req.user._id})
    
    if(employerExisted) {
        res.status(400)
        throw new Error('Employer already exists!')
    }

    const employer = await Employer.create({
        user: req.user._id,
        companyname: req.body.companyname, 
        location: {
            address: req.body.location.address,
            addressTwo: req.body.location.addressTwo, 
            city: req.body.location.city, 
            zip_code: req.body.location.zip_code, 
            state: req.body.location.state, 
            country: req.body.location.country, 
        },
        mobile: req.body.mobile,
        telephone: req.body.telephone, 
        email: req.body.email,
        applications: [] 
    })

    if(employer) {
        res.status(200).json({
            id: employer._id,
            companyname: employer.companyname,
            city: employer.location.city,
            state: employer.location.state,
            country: employer.location.country,
            createdAt: employer.createdAt
        })
    } else {
        res.status(400)
        throw new Error('Invalid employer data!')
    }
})

// @desc    Get all my employers 
// @route   GET /api/employers/
// @access  Private

const getAllMyEmployer = asyncHandler( async (req, res) => {
    
    const employers = await Employer.find({user: req.user._id}).sort({companyname: 'asc'})

    if(employers){
        res.json({employers})
    } else {
        res.status(404)
        throw new Error('User not found!')
    }  
})


// @desc    Search for employers 
// @route   GET /api/employers/search/:keyword
// @access  Private

const searchEmployer = asyncHandler( async (req, res) => {
    
    const keyword = req.params.keyword ? {
        companyname: {
            $regex: req.params.keyword,
            $options: 'i'
        }
    } : {}

    const employers = await Employer.find({user: req.user._id, ...keyword})
  
    res.json({employers})
})


// @desc    Update employer 
// @route   PUT /api/employers/:id
// @access  Private

const updateEmployerProfile = asyncHandler( async (req, res) => {
    const employer = await Employer.findById(req.params.id)
 
    if(employer) {
        employer.companyname = req.body.companyname || employer.companyname
        employer.location.address = req.body.address || employer.location.address
        employer.location.addressTwo = req.body.addressTwo || employer.location.addressTwo
        employer.location.city = req.body.city || employer.location.city
        employer.location.zip_code = req.body.zip_code || employer.location.zip_code
        employer.location.state = req.body.state || employer.location.state
        employer.location.country = req.body.country || employer.location.country
        employer.mobile = req.body.mobile || employer.mobile
        employer.telephone = req.body.telephone || employer.telephone
        employer.email = req.body.email || employer.email

        const updatedEmployer = await employer.save()

        res.json({
            id: updatedEmployer._id,
            companyname: updatedEmployer.companyname
        })
    } else {
        res.status(404)
        throw new Error('User not found!')
    }
})


// @desc    Delete employer 
// @route   PUT /api/employers/profile/:id
// @access  Private

const deleteEmployer = asyncHandler( async (req, res) => {
    const employer = await Employer.findById(req.params.id)

    if(employer) {
        await employer.remove()
        res.json({message: 'Employer successfully removed'})
    } else {
        res.status(404)
        throw new Error('Employer not found!')
    }
})


// @desc    Get employer by ID
// @route   GET /api/employers/:id
// @access  Private / Admin

const getEmployerById = asyncHandler( async (req, res) => {
    const employer = await Employer.findById(req.params.id)

    if(employer) {
        res.json(employer)
    } else {
        res.status(404)
        throw new Error('Employer not found!')
    }
})

// @desc    Get all employer 
// @route   GET /api/employers/admin/employerlist
// @access  Private / Admin

const getAllEmployer = asyncHandler( async (req, res) => {
    const employers = await Employer.find().populate('user')

    if(employers) {
        res.json(employers)
    } else {
        res.status(404)
        throw new Error('Employer not found!')
    }
})

// @desc    Get most applied employer 
// @route   GET /api/mostapplied
// @access  Private

const mostAppliedTo = asyncHandler( async (req, res) => {
    const employers = await Employer.find({user: req.user._id}).sort({applicationCount: 'desc'}).limit(5)

    if(employers) {
        res.json(employers)
    } else {
        res.status(404)
        throw new Error('Employer not found!')
    }
})

// @desc    Get last changed employer 
// @route   GET /api/lastchanged
// @access  Private

const lastChangedEmployer = asyncHandler( async (req, res) => {
    const employer = await Employer.find({user: req.user._id}).sort({updatedAt: 'desc'}).limit(1)

    //const user = await User.findById(req.user._id).select('-password')
    //.populate({path: 'applications', populate: { path: 'company', populate:'employer',  options: {sort: {updatedAt: 'desc'}, limit: 1} }})
    
    if(employer) {
        res.json(employer)
    } else {
        res.status(400)
        throw new Error('No employer found!!')
    }
    
})


module.exports = {
    createNewEmployer, 
    getAllMyEmployer, 
    getEmployerById, 
    updateEmployerProfile, 
    deleteEmployer, 
    searchEmployer, 
    getAllEmployer,
    mostAppliedTo,
    lastChangedEmployer
}
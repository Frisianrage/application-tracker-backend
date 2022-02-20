const Employer = require('../../models/employerModel')
const asyncHandler = require('express-async-handler')


// @desc    Create new employer
// @route   POST /api/employers
// @access  Private

const createNewEmployer = asyncHandler( async (req, res) => {
    const { companyname } = req.body
    
    const employerExisted = await Employer.findOne({companyname})

    if(employerExisted) {
        res.status(400)
        throw new Error('Employer already exists!')
    }

    const employer = await Employer.create({
        user: req.user._id,
        companyname
    })

    if(employer) {
        res.status(200).json({
            id: employer._id,
            companyname: employer.companyname
        })
    } else {
        res.status(400)
        throw new Error('Invalid employer data!')
    }
})


// @desc    Get all my employers 
// @route   GET /api/employers
// @access  Private

const getAllMyEmployer = asyncHandler( async (req, res) => {
    
    console.log(req.params)
    /*const pageSize = 10
    const page = Number(req.query.pageNumber) || 1
*/
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
        employer.address.street = req.body.address.street || employer.address.street
        employer.address.house_no = req.body.address.house_no || employer.address.house_no
        employer.address.city = req.body.address.city || employer.address.city
        employer.address.zip_code = req.body.address.zip_code || employer.address.zip_code
        employer.address.country = req.body.address.country || employer.address.country
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
// @route   PUT /api/employers/:id
// @access  Private /Admin

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


module.exports = {createNewEmployer, getAllMyEmployer, getEmployerById, updateEmployerProfile, deleteEmployer}
const User = require('../../models/userModel')
const asyncHandler = require('express-async-handler')
const generateToken = require('../../utils/generateToken')


// @desc    Register new user
// @route   POST /api/users
// @access  Public

const registerNewUser = asyncHandler( async (req, res) => {
    const {email, password} = req.body
    
    const userExisted = await User.findOne({email})

    if(userExisted) {
        res.status(400)
        throw new Error('User already exists!')
    }

    const user = await User.create({
        email,
        password,
        firstname: '',
        lastname: '',
        location: {
            address: '',
            addressTwo: '',
            zip_code: '',
            city: '',
            country: '',
        },
        resume: {
            content: '',
            date: ''
        },
        mobile: '',
        telephone: ''
    })

    if(user) {
        res.status(200).json({
            id: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id, user.firstname, user.email, user.isAdmin)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data!')
    }
})


// @desc    Login user & get token
// @route   POST /api/users/login
// @access  Public

const loginUser = asyncHandler( async (req,res) => {
    const {email, password} = req.body

    const user = await User.findOne({email})

    if(user && (await user.matchPassword(password))){
        res.json({
            id: user._id,
            firstname: user.firstname,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id, user.firstname, user.email, user.isAdmin)
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private

const getUserProfile = asyncHandler( async (req, res) => {
    
    try {
        const user = await User.findById(req.user._id).select('-password').populate("applications")

        if(user) {
            res.json(user)
        } else {
            res.status(404)
            throw new Error('User not found!')
        }
    } catch (error) {
        res.status(400)
        throw new Error('Invalid request!')
    }
})


// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private

const updateUserProfile = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id)
    console.log(req.body)

    if(user) {
        user.firstname = req.body.firstName || user.firstname
        user.lastname = req.body.lastName || user.lastname
        user.location.address = req.body.address || user.location.address
        user.location.addressTwo = req.body.addressTwo || user.location.addressTwo
        user.location.city = req.body.city || user.location.city
        user.location.zip_code = req.body.zip_code || user.location.zip_code
        user.location.state = req.body.state || user.location.state
        user.location.country = req.body.country || user.location.country
        user.mobile = req.body.mobile || user.mobile
        user.telephone = req.body.telephone || user.telephone
        user.email = req.body.email || user.email
        user.resume = req.body.resume || user.resume

        if(req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()

        res.json({
            user: updatedUser,
            token: generateToken(updatedUser._id, updatedUser.firstname, updatedUser.email, updatedUser.isAdmin)
        })
    } else {
        res.status(404)
        throw new Error('User not found!')
    }
})


// @desc    Delete user profile
// @route   PUT /api/users/profile
// @access  Private /Admin

const deleteUser = asyncHandler( async (req, res) => {
    const user = await User.findById(req.params.id)

    if(user) {
        await user.remove()
        res.json({message: 'User successfully removed'})
    } else {
        res.status(404)
        throw new Error('User not found!')
    }
})


// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private / Admin

const getUserById = asyncHandler( async (req, res) => {
    const user = await User.findById(req.params.id)
    console.log(user)
    if(user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})


// @desc    Get all user 
// @route   GET /api/admin/userslist
// @access  Private / Admin

const getAllUsers = asyncHandler( async (req, res) => {
    const users = await User.find()

    if(users) {
        res.json(users)
    } else {
        res.status(400)
        throw new Error('No users found!!')
    } 
})


// @desc    Update user 
// @route   PUT /api/users/:id
// @access  Private / Admin

const updateUser = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id)

    if(user) {
        user.firstname = req.body.firstname || user.firstname
        user.lastname = req.body.lastname || user.lastname
        user.location.address = req.body.address || user.location.address
        user.address.addressTwo = req.body.addressTwo || user.location.addressTwo
        user.location.city = req.body.city || user.location.city
        user.location.zip_code = req.body.zip_code || user.location.zip_code
        user.location.state = req.body.state || user.location.state
        user.location.country = req.body.country || user.location.country
        user.email = req.body.email || user.email
        user.telephone = req.body.telephone || user.telephone
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin || user.isAdmin
        

        if(req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()

        res.json({
            id: updatedUser._id,
            firstname: updatedUser.firstname,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    } else {
        res.status(404)
        throw new Error('User not found!')
    }
})


// @desc    add new resume
// @route   PUT /api/users/profile/resume
// @access  Private

const addNewResume = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id)
    console.log(user)
    if(user) {
        user.resume.content = req.body.base64
        user.resume.date = Date.now()
        user.resume.name = req.body.name
        user.resume.type = req.body.type

        const updatedUser = user.save()
        console.log(updatedUser)
        res.json(updatedUser)
    } else {
        res.status(400)
        throw new Error('Invalid file data!')
    } 
})

// @desc    delete resume
// @route   PUT /api/users/profile/resume
// @access  Private

const deleteResume = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id)
    console.log(user)
    if(user) {
        user.resume.content = req.body.content
        user.resume.date = req.body.date
        user.resume.name = req.body.name
        user.resume.type = req.body.type

        const updatedUser = user.save()
        console.log(updatedUser)
        res.json(updatedUser)
    } else {
        res.status(400)
        throw new Error('Invalid file data!')
    } 
}) 


module.exports = {registerNewUser, loginUser, getUserProfile, updateUserProfile, deleteUser, getUserById, updateUser, getAllUsers, addNewResume, deleteResume}
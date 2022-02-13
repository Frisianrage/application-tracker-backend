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
        password
    })

    if(user) {
        res.status(200).json({
            id: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data!')
    }
})

// @desc    Login user & get token
// @route   POST /api/users/login
// @access  Public

const loginUser = asyncHandler(async (req,res) => {
    const {email, password} = req.body

    const user = await User.findOne({email})

    if(user && (await user.matchPassword(password))){
        res.json({
            id: user._id,
            firstname: user.firstname,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private

const getUserProfile = asyncHandler(async (req, res) => {
    
    try {
        const user = await User.findById(req.user._id)

        if(user) {
            res.json({
                id: user._id,
                firstname: user.firstname,
                email: user.email,
                isAdmin: user.isAdmin
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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if(user) {
        user.firstname = req.body.firstname || user.firstname
        user.lastname = req.body.lastname || user.lastname
        user.address.street = req.body.address.street || user.address.street
        user.address.house_no = req.body.address.house_no || user.address.house_no
        user.address.city = req.body.address.city || user.address.city
        user.address.zip_code = req.body.address.zip_code || user.address.zip_code
        user.email = req.body.email || user.email
        user.telephone = req.body.telephone || user.telephone
        user.email = req.body.email || user.email

        if(req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()

        res.json({
            id: updatedUser._id,
            firstname: updatedUser.firstname,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })
    } else {
        res.status(404)
        throw new Error('User not found!')
    }
})

// @desc    Delete user profile
// @route   PUT /api/users/profile
// @access  Private /Admin

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.body._id)

    if(user) {
        await user.remove()
        res.json({message: 'User successfully removed'})
    } else {
        res.status(404)
        throw new Error('USer not found!')
    }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private / Admin

const getUserById = asyncHandler(async(req, res) => {
    const user = await User.findById(req.body._id)

    if(user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Get all user 
// @route   GET /api/users/:id
// @access  Private / Admin

const getAllUsers = asyncHandler(async(req, res) => {
    const users = User.find({})
    res.json({users})
})

// @desc    Update user 
// @route   PUT /api/users/:id
// @access  Private / Admin

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if(user) {
        user.firstname = req.body.firstname || user.firstname
        user.lastname = req.body.lastname || user.lastname
        user.address.street = req.body.address.street || user.address.street
        user.address.house_no = req.body.address.house_no || user.address.house_no
        user.address.city = req.body.address.city || user.address.city
        user.address.zip_code = req.body.address.zip_code || user.address.zip_code
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


module.exports = {registerNewUser, loginUser, getUserProfile, updateUserProfile, deleteUser, getUserById, updateUser, getAllUsers}
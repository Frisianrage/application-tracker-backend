const User = require('../../models/userModel')
const asyncHandler = require('express-async-handler')
const generateToken = require('../../utils/generateToken')

// @desc    Register new user
// @route   POST /api/users
// @access  Public

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private

// @desc    Delete user profile
// @route   PUT /api/users/profile
// @access  Private /Admin

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private / Admin

// @desc    Update user 
// @route   PUT /api/users/:id
// @access  Private / Admin
const Employer = require('../../models/employerModel')
const asyncHandler = require('express-async-handler')

// @desc    Create new application
// @route   POST /api/applications
// @access  Private

// @desc    Get all applications 
// @route   GET /api/applications
// @access  Private

// @desc    Get single application 
// @route   GET /api/applications/:id
// @access  Private

// @desc    Update application general
// @route   PUT /api/applications/:id
// @access  Private

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private

// @desc    Delete application 
// @route   PUT /api/applications/:id
// @access  Private /Admin
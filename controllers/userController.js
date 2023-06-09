const User = require("../models/userModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const sendToken = require("../utils/sendToken");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const { sendOtp, verifyOtp } = require("../utils/msegatService");
// Register User
exports.registerUser = asyncErrorHandler(async (req, res, next) => {
    const { firstName, lastName, email, password, phone, passportNumber, birthday, status, saudiId, nationality } = req.body;

    const userData = {
        firstName,
        lastName,
        email,
        password,
        phone,
        birthday,
        status,
    };

    if (status === "citizen" || status === "resident") {
        userData.nationalId = saudiId;
    } else {
        userData.passport = {
            country: nationality,
            id: passportNumber,
        };
    }

    const user = await User.create(userData);

    // Create email confirmation token
    const confirmationToken = user.getConfirmationToken();
    user.emailVerified = false;
    user.emailVerificationToken = confirmationToken;
    user.emailVerificationExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save({ validateBeforeSave: false });

    // Create confirmation URL
    const confirmUrl = `${req.protocol}://${req.get("host")}/confirm_email/${confirmationToken}`;

    try {
        await sendEmail.sendEmailConfirm({
            email: email,
            data: {
                confirm_url: confirmUrl,
            },
        });
        sendToken(user, 201, res);
    } catch (error) {
        user.confirmationToken = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});
exports.confirmEmail = asyncErrorHandler(async (req, res, next) => {
    try {
        // Get token from URL
        const confirmationToken = req.params.token;

        // Hash the token
        const hashToken = crypto
            .createHash("sha256")
            .update(confirmationToken)
            .digest("hex");

        const user = await User.findOne({
            confirmEmailToken: hashToken,
        });

        // If no user or the token has expired, send an error
        if (!user) {
            return next(new ErrorHandler("Invalid confirmation link", 400));
        }

        // If the user exists and the token is valid, confirm the email and remove the token
        user.emailVerified = true;
        user.confirmEmailToken = undefined; // Changed from 'confirmationToken'

        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: "Email confirmed",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
exports.sendEmailConfirmation = asyncErrorHandler(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Create email confirmation token
    const confirmationToken = user.getConfirmationToken();
    await user.save({ validateBeforeSave: false });

    // Create confirmation URL
    const confirmUrl = `${req.protocol}://https://travelcotest.netlify.app/confirm_email/${confirmationToken}`;

    try {
        await sendEmail.sendEmailConfirm({
            email: user.email,
            data: {
                confirm_url: confirmUrl,
            },
        });

        res.status(200).json({
            success: true,
            message: 'Email confirmation sent'
        });
    } catch (error) {
        user.confirmationToken = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});
// Send OTP
exports.sendPhoneVerification = asyncErrorHandler(async (req, res, next) => {
    const { phone } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
        return next(new ErrorHandler("User Not Found", 404));
    }

    // Send OTP using Msegat API
    const response = await sendOtp(phone);

    // Store OTP id in the database for verification
    user.phoneVerificationId = response.id;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "OTP has been sent",
        data: response,
    });
});

// Verify the phone verification code
exports.verifyPhone = asyncErrorHandler(async (req, res, next) => {
    const { phone, verificationCode } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
        return next(new ErrorHandler("User Not Found", 404));
    }

    // Verify OTP using Msegat API
    const response = await verifyOtp(verificationCode, user.phoneVerificationId);

    if (response.code !== 1) {
        return next(new ErrorHandler("Invalid verification code", 400));
    }

    // If valid, set phoneVerified to true and remove the phoneVerificationId
    user.phoneVerified = true;
    user.phoneVerificationId = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Phone number verified successfully",
    });
});

exports.loginUser = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email And Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    // Generate JWT token first
    const token = user.getJWTToken();

    // Convert user to JSON object
    const userObj = user.toObject();

    // Send token and userObj
    res.status(201).json({
        success: true,
        token,
        user: userObj,
    });
});

// Logout User
exports.logoutUser = asyncErrorHandler(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

// Get User Details
exports.getUserDetails = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findById(req.body.user);

    // Generate JWT token first
    const token = user.getJWTToken();

    // Convert user to JSON object
    const userObj = user.toObject();

    // Send token and userObj
    res.status(201).json({
        success: true,
        token,
        user: userObj,
    });
});


// Update Password
exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findById(req.body.user).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is Invalid", 400));
    }

    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 201, res);
});

// Update User Profile
exports.updateProfile = asyncErrorHandler(async (req, res, next) => {
    const newUserData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        drivingLicense: req.body.drivingLicense,
        nationalId: req.body.nationalId,
        passport: req.body.passport,
    };

    // Upload new avatar image
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });
    newUserData.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
    };

    const updatedUser = await User.findByIdAndUpdate(req.body.user, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user: updatedUser,
    });
});











///////////


// Forgot Password
exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User Not Found", 404));
    }

    const resetToken = await user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `https://${req.get(
        "host"
    )}/password/reset/${resetToken}`;

    try {
        await sendEmail({
            email: user.email,
            data: {
                reset_url: resetPasswordUrl,
            },
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});

// Reset Password
exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
    // create hash token
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.body.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler("Invalid reset password token", 404));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);
});




// ADMIN DASHBOARD

// Get All Users --ADMIN
exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

// Get Single User Details --ADMIN
exports.getSingleUser = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        user,
    });
});

// Update User Role --ADMIN
exports.updateUserRole = asyncErrorHandler(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        role: req.body.role,
    };

    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

// Delete Role --ADMIN
exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 404)
        );
    }

    await user.remove();

    res.status(200).json({
        success: true,
    });
});

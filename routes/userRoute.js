const express = require("express");
const {
    registerUser,
    loginUser,
    logoutUser,
    getUserDetails,
    forgotPassword,
    resetPassword,
    updatePassword,
    updateProfile,
    getAllUsers,
    getSingleUser,
    updateUserRole,
    deleteUser,
    confirmEmail,
    verifyPhone,
    sendPhoneVerification,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const { isVendor } = require("../middlewares/isVendor");
const { sendOtp } = require("../utils/msegatService");


const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);

router.route("/confirm_email/:token").get(confirmEmail);
router.route("/me").post(getUserDetails);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/password/update").put(updatePassword);
router.post('/sendOtp', sendPhoneVerification);

// Verify OTP code
router.post('/verifyPhone', verifyPhone);
router.route("/me/update").put(updateProfile);

router
    .route("/admin/users")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

router
    .route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

// vender routes





module.exports = router;

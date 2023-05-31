const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please Enter Your First Name"],
    },

    lastName: {
        type: String,
        required: [true, "Please Enter Your Last Name"],
    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },

    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
    },
    emailVerified: {
        type: Boolean,
        default: false
    },

    phone: {
        type: Number,
        required: [true, "Please Enter Your Phone Number"],
    },
    phoneVerified: {
        type: Boolean,
        default: false
    },

    drivingLicense: {
        type: Number,
    },
    nationalId: {
        type: Number,
    },
    passport: {
        type: Number,
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }],
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should have atleast 8 chars"],
        select: false,
    },
    isVerified: {
        type: Boolean,
        default: function () {
            return this.emailVerified && this.phoneVerified;
        }
    },
    role: {
        type: String,
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

// other pre-save, methods, and exports stay the same...



userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.getConfirmationToken = function () {
    const confirmationToken = crypto.randomBytes(20).toString("hex");
    this.confirmEmailToken = crypto
        .createHash("sha256")
        .update(confirmationToken)
        .digest("hex");
    this.confirmEmailExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    return confirmationToken;
};
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = async function () {
    // generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // generate hash token and add to db
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("User", userSchema);

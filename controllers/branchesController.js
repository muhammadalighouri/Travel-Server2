// Assuming you have a `Branch` model defined
const Branch = require("../models/branchModel");

// Controller function to get all branches
async function getAllBranches(req, res) {
    try {
        const branches = await Branch.find();
        res.json(branches);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

// Controller function to get a branch by ID
async function getBranchById(req, res) {
    try {
        const branch = await Branch.findById(req.params.id);
        if (!branch) {
            return res.status(404).json({ message: "Branch not found" });
        }
        res.json(branch);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

// Controller function to create a new branch
async function createBranch(req, res) {
    try {
        const newBranch = await Branch.create(req.body);
        res.status(201).json(newBranch);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Controller function to update a branch by ID
async function updateBranch(req, res) {
    try {
        const updatedBranch = await Branch.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedBranch) {
            return res.status(404).json({ message: "Branch not found" });
        }
        res.json(updatedBranch);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

// Controller function to delete a branch by ID
async function deleteBranch(req, res) {
    try {
        const deletedBranch = await Branch.findByIdAndDelete(req.params.id);
        if (!deletedBranch) {
            return res.status(404).json({ message: "Branch not found" });
        }
        res.json({ message: "Branch deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getAllBranches,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch,
};

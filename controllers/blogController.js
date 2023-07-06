const Blog = require("../models/blogModel");
const cloudinary = require("cloudinary");

// Get all blogs
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Create a new blog
exports.createBlog = async (req, res) => {
    try {
        let image = null;
        if (req.file) {
            const myCloud = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: "blogImages",
                width: 150,
                crop: "scale",
            });
            image = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        const blog = new Blog({
            title: req.body.title,
            content: req.body.content,
            image: image,
        });

        await blog.save();

        res.status(201).json(blog);
    } catch (err) {
        res.status(400).json({ error: "Bad Request" });
    }
};

// Update an existing blog
exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        blog.title = req.body.title || blog.title;
        blog.content = req.body.content || blog.content;

        if (req.file) {
            blog.image = req.file.path;
        }

        await blog.save();

        res.json(blog);
    } catch (err) {
        res.status(400).json({ error: "Bad Request" });
    }
};

// Delete an existing blog
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);

        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        res.sendStatus(204);
    } catch (err) {
        res.status(400).json({ error: "Bad Request" });
    }
};

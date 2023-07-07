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
        const { title, content, image } = req.body;
        const imageUploadResult = await cloudinary.v2.uploader.upload(image, {
            folder: "blogs",
            width: 550,
            crop: "scale",
        });

        const blogData = {
            title: title,
            content: content,
            image: {
                public_id: imageUploadResult.public_id,
                url: imageUploadResult.secure_url,
            },
        };

        const blog = await Blog.create(blogData);

        res.status(201).json(blog);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "Bad bRequest" });
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

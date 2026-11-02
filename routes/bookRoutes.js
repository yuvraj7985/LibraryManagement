const express = require("express");
const router = express.Router();

const Book = require("../models/Book");

// SUBTASK 1: POST API

router.post("/", async (req, res) => {
    try {
        const { title, author, category } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const book = new Book({
            title,
            author,
            category
        });

        await book.save();

        res.status(201).json({
            message: "Book added successfully",
            book
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});


// SUBTASK 2: GET API

router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const books = await Book.find()
            .skip(skip)
            .limit(limit);

        const totalBooks = await Book.countDocuments();

        res.status(200).json({
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
            books
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

// SUBTASK 3: UPDATE BOOK AVAILABILITY

router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { availability } = req.body;

        if (typeof availability !== "boolean") {
            return res.status(400).json({
                message: "Availability must be true or false"
            });
        }

        const book = await Book.findByIdAndUpdate(
            id,
            { availability },
            { new: true }
        );

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json({
            message: "Book availability updated successfully",
            book
        });

    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({
                message: "Invalid Book ID"
            });
        }

        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = router;
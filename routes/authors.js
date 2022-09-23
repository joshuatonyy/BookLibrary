const express = require('express');
const Author = require('../models/author');
const Book = require('../models/book');
const router = express.Router();

// ALL AUTHORS ROUTE
router.get('/', async(req, res) => {
    let searchOptions = {}
    if(req.query.name != null && req.query !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', { 
            authors: authors, 
            searchOptions: req.query 
        })
    } catch {
        res.redirect('/')
    }
}) 

// NEW AUTHOR ROUTE
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save();
        //res.redirect(`authors/{newAuthor.id}`)
        res.redirect('authors');
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

router.get('/:id', async (req, res) => {
    try{
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id }).limit(5).exec();
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
    } catch (error) {
        res.redirect('/authors')
    }
})

router.put('/:id', async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name
        await author.save();
        res.redirect(`/authors/${author.id}`)
    } catch {
        if (author == null) {
            res.redirect('/');
        } else{
        res.render('authors/edit', {
            author: author,
            errorMessage: 'Error updating Author'
        })
    }
    }
})

router.delete('/:id', async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name
        await author.remove();
        res.redirect(`/authors`)
    } catch {
        if (author == null) {
            res.redirect('/');
        } else {
            res.redirect(`/authors/${author.id}`)
        }
    }
})

module.exports = router;
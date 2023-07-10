require('dotenv').config();
const express = require('express');
const morgan = require('morgan')
const methodOverride = require("method-override");
const Book = require('./models/books.js');
const app = express();

app.use (morgan('dev'))
app.use (express.urlencoded({ extended: false })) // whenever forms are involved we need this middlware.
app.use (methodOverride("_method"))


app.get("/", (req, res) => {
    res.send("Hello World")
});

app.get("/books", async(req, res) => {
    // get all the books from the mongo db
    const allBooks = await Book.find({});
    // and then render the index.ejs file
    res.render('index.ejs', { books: allBooks })
})

// SHOW
app.get("/books/new", (req, res) => {
    res.render("new.ejs")
});  


// whenever we click on te "add book" button on the /books/new page this will be called
app.post('/books', async (req, res) => {
    if(req.body.completed === 'on') {
        req.body.completed = true;
    } else {
        req.body.completed = false;
    }
    await Book.create(req.body)
    res.redirect('/books')
});

app.get("/books/:id", async (req, res) => {
    const foundBook = await Book.findById(req.params.id)
    res.render('show.ejs', { book: foundBook })
})



app.delete('/books/:id', async (req, res) => {
    await Book.findByIdAndDelete(req.params.id)
    res.redirect('/books')
})

app.get('/books/:id/edit', async (req, res) => {
    const book = await Book.findById(req.params.id)
    res.render("edit.ejs", { book })
})

app.put('/books/:id', async (req, res) => {
    if(req.body.completed === 'on'){
        req.body.completed = true;
    }else {
        req.body.completed = false;
    }

    await Book.findByIdAndUpdate(req.params.id, req.body)

    // console.log(req.body)
    
    res.redirect('/books');
})

app.listen(
    process.env.PORT,
    () => console.log(`listening on port ${process.env.PORT}`)
);
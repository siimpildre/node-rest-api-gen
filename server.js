import express, { request } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.get('/', (request, response) => {
    response.status(200).send('Welcome')
})

app.get('/books', async (request, response) => {
    //sql keel mis palub tuua sealt andmeid, see ei ole turvaline viis:
    //const sql = "SELECT * FROM books";
    //lihtsam viis, aga ikka ei ole turvaline:
    //books.getAll();

    try {
        const books = await prisma.books.findMany();
        response.status(200).json(books);
    } catch (error) {
        console.log(error);
        response.status(400).send({
            message: 'Midagi läks valesti',
        })
    }
});

app.get('/authors', async (request, response) => {
    try {
        const authors = await prisma.authors.findMany();
        response.status(200).json(authors);
    } catch (error) {
        console.log(error);
        response.status(400).send({
            message: 'Midagi läks valesti',
        })
    }
});

app.get('/books/:id', async (request, response) => {
    // const id = request.params.id;

    try {
        const { id } = request.params;

    const book = await prisma.books.findUnique({
        where: {
            id: Number(id),
        },
    });

    if (!book) {
        throw new Error('Raamatut ei leitud');
    }

    response.status(200).json(book);

    } catch (error) {
        console.log(error);
        response.status(400).send({
            message: error.message,
        });
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening port ${PORT}`);
}); 
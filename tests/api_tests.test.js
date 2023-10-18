const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('../utils/list_helper')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})
describe('blogs are fetched as expected', () => {
    test('blogs are returned as JSON', async () => {
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('number of blogs returned is as expected', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('Unique identifier is id not _id', async () => {
        const response = await api.get('/api/blogs')

        const blogs = await response.body
        for (let blog of blogs) {
            expect(blog.id).toBeDefined()
        }
    })
})

describe('a blog is added correctly', () => {

    test('A new blog can be added', async () => {
        const newBlog = {
            title: 'NEW BLOG',
            author: 'NEW AUTHOR',
            url: 'www.newblog.com',
            likes: 0,
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const updatedBlogs = await helper.blogsInDb()
        expect(updatedBlogs).toHaveLength(helper.initialBlogs.length + 1)
    })

    test('if blog doesnt have likes, default to 0 likes', async () => {
        const newBlog = {
            title: 'No Likes',
            author: 'Likeless author',
            url: 'www.newblog.com',
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    })
})


describe('a blog can be deleted', () => {
    test('number of blogs is fewer when one is deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    })
})

describe('a blog is modified correctly', () => {
    test('number of likes is updated in database', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[1]
        const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtStart[1].likes + 1).toBe(blogsAtEnd[1].likes)
    })
})



afterAll(async () => {
    await mongoose.connection.close()
})
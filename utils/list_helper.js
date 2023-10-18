const Blog = require('../models/blog')


const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    let total = 0

    blogs.forEach(blog => {
        total += blog.likes
    })

    return blogs.length === 0
        ? 0
        : total
}

const favoriteBlog = (blogs) => {

    const favorite = blogs.reduce((prev, current) => {
        return (prev && prev.likes > current.likes)
            ? prev
            : current
    })

    const { title, author, likes } = favorite
    const favBlogObj = { title, author, likes }
    return favBlogObj
}

const initialBlogs = [
    {
        title: 'BlogPost1',
        author: 'Mark Ronson',
        url: 'www.randomurl.com',
        likes: 7,
        id: '650c3eb6eaa3ebfe5025137b'
    },
    {
        title: 'TEST BLOG',
        author: 'TEST AUTHOR',
        url: 'example url',
        likes: 6,
        id: '650c764f7e1b3b700fbc1c5a'
    },
    {
        title: 'Botany for beginners',
        author: 'Mark Watney',
        url: 'www.nasa.org/mwbotany',
        likes: 6,
        id: '650c8c5a3f1b942653e4e183'
    },
    {
        title: 'Wines of Burgundy',
        author: 'Tonya Clayton',
        url: 'www.vivino.com',
        likes: 18,
        id: '650d483dfb4fe89430819fea'
    },
    {
        title: 'Wines of Burgundy: 2',
        author: 'Tonya Clayton',
        url: 'www.vivino.com',
        likes: 15,
        id: '65180744281bacedaf57b357'
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    initialBlogs,
    blogsInDb
}
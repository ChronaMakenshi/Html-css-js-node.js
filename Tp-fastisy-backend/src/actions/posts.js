import {db} from "../database.js";
import {RecordNotFoundError} from "../errors/RecordNotFoundError.js";
import {verifyUser} from "../function/auth.js";

export const  listPosts = (req, res) => {
    const posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all()
    res.view('templates/index.ejs', {
        posts,
        user: req.session.get('user')
    })
}

export const showPost = (req, res) => {
    const post = db.prepare(`SELECT * FROM posts WHERE id = ?`).get(req.params.id)
    if (post === undefined) {
        throw new RecordNotFoundError(`Ìmpossible de trouver l'article avec l'id ${req.params.id}`)
    }
    return res.view('templates/single.ejs', {
        post
    })
}

export const createPost = (req, res) => {
    verifyUser(req)
    db.prepare('INSERT INTO posts (title, content, created_at) VALUES (?, ?, ?)').run(
        req.body.title,
        req.body.content,
        Math.round(Date.now() / 1000)
    )
    return res.redirect('/')
}
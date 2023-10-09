import fastify from "fastify";
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
import fastifySecureSession from "@fastify/secure-session";
import ejs from 'ejs';
import { fileURLToPath} from "node:url"
import { dirname, join } from "node:path"
import {db} from "./database.js";
import { readFileSync } from "node:fs"
import {createPost, listPosts, showPost} from "./actions/posts.js";
import {RecordNotFoundError} from "./errors/RecordNotFoundError.js";
import fastifyFormbody from "@fastify/formbody";
import {loginAction, logoutAction} from "./actions/auth.js";
import {NotAuthenticatedError} from "./errors/NotAuthenticatedError.js";

const app = fastify()
const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))

app.register(fastifyView, {
    engine: {
        ejs
    }
})
app.register(fastifyFormbody)
app.register(fastifyStatic, {
    root: join(rootDir, 'public'),
})
app.register(fastifySecureSession, {
    cookieName: 'session',
    key: readFileSync(join(rootDir, 'secret-key')),
    cookie: {
        path: '/'
    }
})
app.get('/', listPosts)
app.post('/', createPost)
app.get('/login', loginAction)
app.post('/login', loginAction)
app.post('/logout', logoutAction)
app.get('/article/:id', showPost)
app.setErrorHandler((error, req, res) => {
    if (error instanceof RecordNotFoundError){
        res.statusCode = 404
        return res.view('templates/404.ejs', {
            error:'Cet enregistrement n\'existe pas'
        })
    } else if (error instanceof  NotAuthenticatedError) {
        return res.redirect('/login')
    }
    console.error(error)
    res.statusCode = 500
    return {
        error: error.message
    }
})
const start = async () => {
    try {
        await app.listen({port: 8000})
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}
start()
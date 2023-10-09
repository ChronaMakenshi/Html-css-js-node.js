import {NotAuthenticatedError} from "../errors/NotAuthenticatedError.js";

export function verifyUser (req) {
    if (!req.session.get('user')) {
        throw new NotAuthenticatedError()
    }
}
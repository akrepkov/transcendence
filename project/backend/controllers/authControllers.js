import * as authServices  from '../services/authServices.js';
import {handleError} from '../utils/utils.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const JWT_SECRET = "" + process.env.JWT_SECRET; //using environmental variable for JWT secret



const loginHandler = async(request, reply) => {
    // console.log('SECRET in Login:', process.env.JWT_SECRET);
    // console.log('Incoming data in Login:', request.body);
    // console.log ("Password: ", user.password, password);
    const { email, password } = request.body;
    if (!email || !password) {
        return handleError(reply, new Error('Email and password are required'), 400);
    }
    const user = await authServices.checkCredentials(email);
    if (!user) {
        return handleError(reply, new Error('Invalid credentials'), 401);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return handleError(reply, new Error('Invalid credentials'), 401);
    }
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
    // Set the JWT in an HTTP-only cookie
    reply.setCookie('token', token, {
        httpOnly: true,  // Ensures it's not accessible via JavaScript
        secure: true,
        sameSite: 'Strict',  // Prevents cross-site request forgery attacks
        path: '/',  // Cookie is available on all routes
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
    return reply.status(201).send({ message: 'Registration successful' });
}

const registerHandler = async (request, reply) => {
    // console.log('Incoming data:', { email, username , password});
    const { email, password, username } = request.body;

    if (!email || !password || !username) {
        return handleError(reply, new Error('Email, username and password are required'), 400);
    }

    try {
        // const hashedPassword = await bcrypt.hash(password, 10);
        const registerUser = authServices.registerInDatabase(email, password, username);

        if (!registerUser) {
            return handleError(reply, new Error('Registration failed'), 500);
        }
        // DO I NEED TOKEN HERE????????????????????
        // const token = fastify.jwt.sign({ email, username }, JWT_SECRET, { expiresIn: '1h' });
        // // Set the JWT in an HTTP-only cookie
        // reply.setCookie('token', token, {
        // 	httpOnly: true,  // Ensures it's not accessible via JavaScript
        // 	secure: true,
        // 	sameSite: 'Strict',  // Prevents cross-site request forgery attacks
        // 	path: '/',  // Cookie is available on all routes
        // 	expires: 7 * 24 * 60 * 60, // 7 days
        // });
        return reply.status(201).send({ message: 'Registration successful' });
    } catch (err) {
        console.error('Registration error:', err);
        return handleError(reply, new Error('Registration failed'), 500);
    }
};

const googleHandler = async(request, reply) => {
    //https://github.com/googleapis/google-api-nodejs-client
    //https://developers.google.com/identity/protocols/oauth2
    // GOOGLE auth implementation:
    // https://dev.to/fozooni/google-oauth2-with-fastify-typescript-from-scratch-1a57
    //Theory?
};


const logoutHandler = async(request, reply) => {
//API response:
    reply.clearCookie('token', {path: '/'});
    reply.send({ message: 'Logged out successfully' });
}


const verificationHandler = async(request, reply) => {
    const token = await request.cookies.token;
    if (!token) {
        return handleError(reply, new Error('Not authorized'), 401);
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        reply.send({ user: decoded });
    } catch (err) {
        return handleError(reply, new Error('Not authorized'), 401);
    }

}

export default {
	loginHandler,
	registerHandler,
	logoutHandler,
	verificationHandler,

};




// Plan:

// 4. Handle JWT Expiration:
// Since your JWT expires in 1 hour (expiresIn: '1h'), you'll want to handle token expiration 
// on the frontend. After the token expires, you can prompt the user to log in again or implement 
// a refresh token mechanism to extend their session.

// Refresh Tokens: A refresh token is a long-lived token that is used to obtain a new JWT when 
// the original expires. You can implement this by issuing a refresh token alongside the access token (JWT) 
// and store the refresh token in the database.
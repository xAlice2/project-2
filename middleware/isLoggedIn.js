/**
 * 
 * The purpose of this middleware will be to check to see if a user is logged in before they are allowed
 *  to have a access to a specific route. This middleware will be place inside a route between the route 
 * ( /profile ) and the callback with the request ( req ), and response ( res ) parameters inside.
======================================================================================================== */

function isLoggedIn(req, res, next) {
    if (!req.user) {
        req.flash('error', 'You must be signed in to access page');
        res.redirect('/auth/login');
    } else {
        next();
    }
}


// export the function so that we can import to server.js
module.exports = isLoggedIn;
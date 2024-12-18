const { validateToken } = require("../services/auth");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];

        if (!tokenCookieValue) {
            // Return early if the cookie is missing
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
            return next(); // Call next after attaching userPayload to req
        } catch (error) {
            return next(); // Call next on error, allowing next middleware to handle the error
        }
    };
}

module.exports = {
    checkForAuthenticationCookie,
};

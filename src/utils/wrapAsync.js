module.exports = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    };
}

// This utility function takes an asynchronous function (func) as an argument and returns a new function that wraps the original function in a try-catch block. If the original function throws an error, it is caught and passed to the next middleware (next), which is typically an error-handling middleware in Express. This helps to avoid repetitive try-catch blocks in each route handler and ensures that errors are properly propagated.
import rateLimit from 'express-rate-limit'

const loginRateLimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: 'to many requrest for login , please try again later'
})
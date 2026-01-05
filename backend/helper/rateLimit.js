import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

export const loginRateLimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later.',
    keyGenerator: (req) => {
        // Use email as key if provided, otherwise use IP safely
        return req.body.email || ipKeyGenerator(req);
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const OtpRateLimit = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 3,
    message: 'OTP provide 3 times in a day ',
    keyGenerator: (req) => {
        return req.body.email || ipKeyGenerator(req)
    }
})

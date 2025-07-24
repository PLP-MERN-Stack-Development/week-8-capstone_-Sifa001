import { OAuth2Client } from 'google-auth-library';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from '../models/userModel';
import { generateToken } from '../utils/jwtUtil';
import { sendVerificationEmail } from './emailService';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const facebookClientID = process.env.FACEBOOK_CLIENT_ID;
const facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET;

export const googleLogin = async (token: string) => {
    const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userEmail = payload?.email;

    let user = await User.findOne({ email: userEmail });
    if (!user) {
        user = new User({
            email: userEmail,
            role: 'passenger',
            isVerified: true,
        });
        await user.save();
        sendVerificationEmail(userEmail);
    }

    return generateToken(user);
};

export const facebookLogin = async (accessToken: string) => {
    const strategy = new FacebookStrategy({
        clientID: facebookClientID,
        clientSecret: facebookClientSecret,
        callbackURL: '/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'email'],
    }, async (accessToken, refreshToken, profile, done) => {
        const userEmail = profile.emails[0].value;

        let user = await User.findOne({ email: userEmail });
        if (!user) {
            user = new User({
                email: userEmail,
                role: 'passenger',
                isVerified: true,
            });
            await user.save();
            sendVerificationEmail(userEmail);
        }

        done(null, generateToken(user));
    });

    strategy.authenticate(accessToken);
};
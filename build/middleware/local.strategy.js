import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import userSchema from '@models/User.model';
import { getDb } from '@utils/database';
const db = getDb();
console.log(db);
const users = db.get('users');
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        await userSchema.validate({ username, password });
        const user = await users.findOne({ username });
        if (!user) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await users.findOne({ _id: id });
        done(null, user);
    }
    catch (error) {
        done(error);
    }
});
export { passport };

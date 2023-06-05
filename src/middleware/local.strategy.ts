import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import userSchema from '@models/User.model';
import { getDb } from '@utils/database';
import { ICollection, IMonkManager } from 'monk';

let db : IMonkManager , users : ICollection;

setTimeout(()=> {
  db = getDb();
  users = db.get('users');
}, 100);


passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      await userSchema.validate({ username, password });
      const user = await users.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password.' });
        console.log('hey1')
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect username or password.' });
        console.log('hey2')
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await users.findOne({ _id: id });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export { passport };
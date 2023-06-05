import * as monk from 'monk';
import { dbUrl } from '@config/db.config';
let db;
const initDb = () => {
    db = monk.default(dbUrl);
};
const getDb = () => db;
export { initDb, getDb };

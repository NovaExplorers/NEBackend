import * as monk from 'monk';

let db : monk.IMonkManager;

const initDb = ()  => {
    db = monk.default(process.env.DB_URL!);    
}

const getDb = () => db;

export {
    initDb,
    getDb
}
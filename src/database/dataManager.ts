import {
    Database,
    OPEN_CREATE,
    OPEN_READWRITE,
} from 'sqlite3'
import * as fs from 'fs';
import * as path from 'path';
import * as chalk from 'chalk';

class DataManager {
    private db: Database;
    private dbPath: string;

    public pepare(): DataManager {
        this.dbPath = path.resolve('./data/database.db');
        if(!fs.existsSync(this.dbPath)) {
            console.log(chalk.rgb(255, 165, 0)('[WARN] Cannot find database.db! Creating now!'))
            this.db = new Database(this.dbPath, OPEN_CREATE | OPEN_READWRITE, err => err ? console.error(chalk.red(err)) : console.log(chalk.magenta('[INFO] Prepared database.db!')))
        }
        else {
            this.db = new Database(this.dbPath, OPEN_READWRITE, err => err ? console.error(chalk.red(err)) : console.log(chalk.magenta('[INFO] Prepared database.db!')));
        }
        this.db.run(`CREATE TABLE IF NOT EXISTS bans(name TEXT, reason TEXT, date TEXT, auth TEXT)`, err => err ? console.error(chalk.red(err)) : console.log(chalk.green('[SUCESS] Loaded database.db!')))
        return this;  
    }
}

export const DATABASE = new DataManager();
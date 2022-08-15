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
        this.db.run(`CREATE TABLE IF NOT EXISTS bans(name TEXT, reason TEXT, date TEXT)`, err => err ? console.error(chalk.red(err)) : console.log(chalk.green('[SUCESS] Loaded ban data!')))
        this.db.run(`CREATE TABLE IF NOT EXISTS bricks(room TEXT, uuid TEXT, matID INTEGER, color INTEGER, type TEXT, posX REAL, posY REAL, posZ REAL, rotW REAL, rotX REAL, rotY REAL, rotZ REAL, usingNewColor INTEGER, headClientId INTEGER, usingHeadStuff INTEGER)`, err => err ? console.error(chalk.red(err)) : console.log(chalk.green('[SUCESS] Loaded brick data!')))
        this.db.run(`CREATE TABLE IF NOT EXISTS rooms(code TEXT, ownerId TEXT, locked TEXT, name TEXT)`, err => err ? console.error(chalk.red(err)) : console.log(chalk.green('[SUCESS] Loaded rooms data!')))
        return this;
    }

    public async getRoom(room: string): Promise<Room | null> {
        return new Promise((res) => {
            this.db.all(`SELECT * FROM rooms WHERE code = "${room}"`, (err, rows) => {
              if (err) return console.error(chalk.red(err))
              
              return res(rows[0])
            })
        })
    }

    public async createRoom(room: string, userID: string): Promise<string | null | any> {
        return new Promise(async (res) => {
            const code = await this.generateRoomCode()
            this.db.run(`INSERT INTO rooms VALUES("${code}", "${userID}", "false", "${room}")`, (data, err) => {
                if(err) {
                    console.error(err)
                    return res(null)
                }
                else res({
                    name: room,
                    code: code,
                })
            });
        })
    }

    private async generateRoomCode() {
        const code = ("" + Math.random()).substring(2, 10);
        if(await this.roomExist(code)) return this.generateRoomCode();
        else return code;
    }

    public async getBricks(room: string): Promise<any[]> {
        return new Promise((res) => {
            this.db.all(`SELECT * FROM bricks WHERE room = "${room}"`, (err, rows) => {
              if (err) return console.error(chalk.red(err))
              
              return res(rows)
            })
        })
    }

    public async brickAdd(room: string, brick: Brick): Promise<boolean> {
        return new Promise(async (res) => {
          const check = await this.brickExist(room, brick)
          if (check) {
            console.warn(chalk.rgb(255, 165, 0)(`[WARN] The brick with the uuid of "${brick.uuid}" already exists in the brick store.`))
  
            return res(false)
          } else {
            this.db.run(`INSERT INTO bricks VALUES("${room}", "${brick.uuid}", ${brick.matId}, ${brick.color}, "${brick.type}", ${brick.pos.x}, ${brick.pos.y}, ${brick.pos.z}, ${brick.rot.w}, ${brick.rot.x}, ${brick.rot.y}, ${brick.rot.z}, ${brick.usingNewColor ? 1 : 0}, ${brick.headClientId}, ${brick.usingHeadStuff ? 1 : 0})`)
  
            return res(true)
          }
        })
    }

    private async brickExist(room: string, brick: Brick): Promise<boolean> {
        return new Promise(async (res) => {
            this.db.get(`SELECT * FROM bricks WHERE uuid = "${brick.uuid}"`, (err, row) => {
                if (err) return console.error(err)
                if (row == undefined) return res(false)
                
                return res(row.room === room)
            })
        })
    }

    private async roomExist(room: string): Promise<boolean> {
        return new Promise(async (res) => {
            this.db.get(`SELECT * FROM rooms WHERE code = "${room}"`, (err, row) => {
                if (err) return console.error(err)
                if (row == undefined) return res(false)
                
                return res(true)
            })
        })
    }
}

export const DATABASE = new DataManager();

export type Room = {
    code: string;
    ownerId: string;
    name: string;
    locked: string;
}

export type Brick = {
    uuid: string;
    matId: number;
    color: number;
    type: BrickTypes
    pos: {
        x: number;
        y: number;
        z: number;
    }
    rot: {
        w: number;
        x: number;
        y: number;
        z: number;
    }
    usingNewColor: boolean;
    headClientId: number;
    usingHeadStuff: boolean;
}

type BrickTypes = '1x1' | '1x2' | '1x3' | '1x4' | '1x6' | '1x8' | '1x10' | '2x2' | '2x3' | '4x2' | '2x6' | '2x8' | '2x2Corner' | '1x1Tile' | '1x2Tile' | '1x3Tile' | '1x4Tile' | '1x6Tile' | '1x8Tile' | '1x10Tile' | '2x2Tile' | '2x3Tile' | '2x4Tile' | '2x6Tile' | '2x8Tile' | '2x2CornerTile' | '1x1RoundTile' | '1x1Plate' | '1x2Plate' | '1x3Plate' | '1x4Plate' | '1x6Plate' | '1x8Plate' | '1x10Plate' | '2x2Plate' | '2x3Plate' | '2x4Plate' | '2x6Plate' | '2x8Plate' | '2x2CornerPlate' | '1x2Plate1Stud' | '2x2Plate1Stud' | '1x1RoundPlate' | '1x2Slope' | '1x3Slope' | '1x4Slope' | '2x2Slope' | '2x2CornerSlope' | '3x3CornerSlope' | '4x4CornerSlope' | '1x2SlopeInverted' | '1x1-2_3Slope' | '1x4-2_3Slope' | '1x2Window' | 'FlatPlant' | 'ThreeLeafedPlant' | '1x1_1FaceSideStud' | '1x2_1FaceSideStud' | '1x2_1FaceSideStud' | '1x4_1FaceSideStud' | '1x2Masonry' | '1x4Masonry' | '1x3Arch' | '1x4Arch' | '1x6Arch' | '1x1Pyramid' | OtherBricktype;
type OtherBricktype = string & { extra?: any };
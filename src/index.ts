import * as chalk from "chalk";
import { DATABASE } from "./database/DataManager";
import { ROOM_KEY } from "./other/Constants";
import logLogo from "./other/logo";
import * as express from "express";

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(require('./rooms/rooms').router)
app.use(require('./bricks/bricks').router)
app.use(require('./misc/version').router)

app.get('/', (req, res) => {
    res.send({
        apiKey: ROOM_KEY,
        routes: {
            rooms: {
                path: '/rooms',
                length: DATABASE,
                info: {
                    path: '/info/{room}',
                },
                bricksAdd: {
                    path: '/bricks'
                }
            },
            friends: {

            }
        }
    })
})

app.listen(3000, () => {
    logLogo()
    DATABASE.pepare();
})
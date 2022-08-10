import * as chalk from "chalk"
import { DATABASE } from "./database/DataManager"
import { app } from "./other/app"
import { ROOM_KEY } from "./other/Constants"
import logLogo from "./other/logo"

app.get('/', (req, res) => {
    res.send({
        apiKey: ROOM_KEY,
        routes: {
            rooms: {
                path: '/rooms',
                length: DATABASE,
                info: {
                    path: '/info/',
                    headers: ['room_id']
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
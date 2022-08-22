import { Router } from "express";
import { DATABASE } from "../database/DataManager";

export const router = Router()

router.post('/bricks', async (req, res) => {
    const { posx, posy, posz, rotw, rotx, roty, rotz, timestamp, type, matId, color, brickid, room, userid, headClientId } = req.body

    DATABASE.brickAdd(room.split('-')[1], {
        color: color,
        headClientId: headClientId,
        matId: matId,
        pos: {
            x: posx,
            y: posy,
            z: posz
        },
        rot: {
            w: rotw,
            x: rotx,
            y: roty,
            z: rotz,
        },
        type: type,
        usingHeadStuff: headClientId !== -1 ? true : false,
        usingNewColor: true,
        uuid: brickid
    })
    res.send('done')
})

router.post('/bricks/remove', async (req, res) => {
    const { brickid, room } = req.body

    if(!brickid || !room) return res.send(400);

    DATABASE.brickRemove(room.split('-')[1], brickid).then((val) => {
        if(val) res.send('done')
        else res.send(null)
    })
})
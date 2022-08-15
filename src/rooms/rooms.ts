import { Router } from "express";
import { DATABASE } from "../database/DataManager";

export const router = Router()

router.get('/rooms/:room_id', async (req, res) => {
    const data = await DATABASE.getRoom(req.params.room_id)
    const bricks = await DATABASE.getBricks(req.params.room_id)

    if(data) {
        res.send({
            ownerIdPrefix: data.ownerId,
            brickCount: bricks.length,
            locked: data.locked,
            name: data.name,
        })
    }
    else {
        res.send({})
    }
})

router.get('/rooms/bricks/:room_id', async (req, res) => {
    const data = await DATABASE.getRoom(req.params.room_id)
    const bricks = await DATABASE.getBricks(req.params.room_id)

    let brickResponse = bricks.map((brick) => ({
        uuid: brick.uuid,
        matId: brick.matId,
        color: brick.color,
        type: brick.type,
        pos: {
            x: brick.posX,
            y: brick.posY,
            Z: brick.posZ,
        },
        rot: {
            w: brick.rotW,
            x: brick.rotX,
            y: brick.rotY,
            z: brick.rotZ,
        },
        usingNewColor: brick.usingNewColor,
        usingHeadStuff: brick.usingHeadStuff
    }))

    if(data) {
        res.send({
            ownerShortIdPrefix: data.ownerId,
            bricks: brickResponse
        })
    }
    else {
        res.status(404).send(null);
    }
})

router.post('/rooms/create', async (req, res) => {
    if(!req.body.name) return res.status(400).send('Must define room `name`.')
    if(!req.body.userid) return res.status(400).send('Must define `userid`.')
})
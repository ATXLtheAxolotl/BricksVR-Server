import { Router } from "express";
import { DATABASE } from "../database/DataManager";

export const router = Router()

router.get('/rooms/:room_id', async (req, res) => {
    const data = await DATABASE.getRoom(req.params.room_id.split('-')[1])
    const bricks = await DATABASE.getBricks(req.params.room_id.split('-')[1])

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
    const data = await DATABASE.getRoom(req.params.room_id.split('-')[1])
    const bricks = await DATABASE.getBricks(req.params.room_id.split('-')[1])
    
    let brickResponse = bricks.map((brick) => ({
        uuid: brick.uuid,
        matId: brick.matId,
        color: brick.color,
        type: brick.type,
        pos: {
            x: brick.posX,
            y: brick.posY,
            z: brick.posZ,
        },
        rot: {
            w: brick.rotW,
            x: brick.rotX,
            y: brick.rotY,
            z: brick.rotZ,
        },
        headClientId: brick.headClientId,
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
    if(!req.body.name) return res.send(null)
    if(!req.body.userid) return res.send(null)

    const { name, userid } = req.body;

    const room = await DATABASE.createRoom(name, userid);
    
    switch(room) {
        case null:
            res.send(null)
            break;
        default:
            res.send({
                name: room.name,
                code: room.code,
                normcoreRoom: '0.2-' + room.code,
            })
            break;
    }
})
import chalk = require("chalk");
import { Router } from "express";
import { DATABASE } from "../database/DataManager";


export const router = Router()

router.get('/friends', async (req, res) => {
    if(!req.body?.codes) return res.sendStatus(400)
    const friends = await DATABASE.getFriends(req.body.codes)
    res.send(friends);
})

router.post('/friends/online', async (req, res) => {
    if(!req.body?.code) return res.sendStatus(400)

    res.send(200);
})

router.post('/friends/nickname', async (req, res) => {
    if(!req.body?.code || !req.body?.nick) return res.sendStatus(400)

    res.send(200);
})
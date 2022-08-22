import chalk = require("chalk");
import { Router } from "express";
import { VERSION } from "../other/Constants";

export const router = Router()

router.all('/version',(req, res) => {
  const { version } = req.body;
  if(version !== VERSION) {
    console.info(chalk.blue(`[INFO] A user attempted to join with the version of ${version}`));
    return res.send({
        supported: false
    });
  }
  res.send({
    supported: true
  });
})
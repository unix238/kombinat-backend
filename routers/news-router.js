// const Router = require('express');
// const authMiddleware = require('../middleware/authMiddleware');
// const adminMiddleware = require('../middleware/adminMiddleware');
// const NewsController = require('../controllers/news-controller');

import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import NewsController from "../controllers/news-controller.js";

const NewsRouter = Router();

NewsRouter.get("/get", NewsController.getNews);
NewsRouter.get("/get/:id", NewsController.getByID);

NewsRouter.post("/add", NewsController.addNews);
NewsRouter.post("/delete/:id", (req, res) => {});
NewsRouter.post("/edit/:id", (req, res) => {});

// module.exports = NewsRouter;
export default NewsRouter;

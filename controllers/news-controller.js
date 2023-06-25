// const NewsService = require('../services/news-service');
import NewsService from "../services/news-service.js";

class NewsController {
  async getNews(req, res) {
    try {
      const page = req.query.page;
      const limit = req.query.limit;
      const news = await NewsService.getNews(page, limit);
      if (news) {
        res.status(200).json(news);
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: "get news error" });
    }
  }

  async getByID(req, res) {
    try {
      const id = req.params.id;
      const news = await NewsService.getByID(id);
      if (news) {
        res.status(200).json(news);
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: "get news error" });
    }
  }

  async addNews(req, res) {
    try {
      const news = await NewsService.addNews(req.body);
      if (news) {
        res.status(200).json(news);
      }
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  }
}

// module.exports = new NewsController();
export default new NewsController();

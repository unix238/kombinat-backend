const News = require('../models/News');

class NewsService {
  async getNews(page = 1, limit = 10) {
    try {
      const news = await News.find({})
        .skip((page - 1) * limit)
        .limit(limit);
      return news;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getByID(id) {
    try {
      const news = await News.findById(id);
      return news;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async addNews(news) {
    try {
      console.log(news);
      const newNews = await News.create(news);
      newNews.save();
      return newNews;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}

module.exports = new NewsService();

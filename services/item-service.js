// const Item = require("../models/Item");
// const Tag = require("../models/Tag");
// const Brand = require("../models/Brand");
// const Category = require("../models/Category");

import Item from "../models/Item.js";
import Tag from "../models/Tag.js";
import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
import Seller from "../models/Seller.js";

class ItemService {
  async getItems(page = 1, limit = 10) {
    try {
      const totalItems = await Item.find({});
      const items = await Item.find({})

        .skip((page - 1) * limit)
        .limit(limit);
      return { items, totalItems: totalItems.length };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getByID(id) {
    try {
      const item = await Item.findById(id);

      const tags = await Tag.find({ _id: { $in: item.tags } });
      const brand = await Brand.findById(item.brand);
      const category = await Category.findById(item.category);
      const seller = await Seller.findById(item.seller);

      // Create an object that includes all the data
      const itemWithData = {
        ...item._doc,
        tags,
        brand,
        category,
        seller,
      };

      return itemWithData;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async addItem(item) {
    try {
      const newItem = await Item.create(item);
      newItem.save();
      return newItem;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getTagByID(id) {
    try {
      const tag = await Tag.findById(id);
      return tag;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getAllTags() {
    try {
      const tags = await Tag.find({});
      return tags;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async addTag(tag) {
    try {
      const { title, link } = tag;
      const newTag = await Tag.create({ title, link });
      newTag.save();
      return newTag;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async addCategory(category) {
    try {
      const newCategory = await Category.create(category);
      newCategory.save();
      return newCategory;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getAllCategories() {
    try {
      const categories = await Category.find({});
      return categories;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getItemsByTag(link, page = 1, limit = 12) {
    try {
      const tag = await Tag.find({ link: link });
      const totalItems = await Item.find({ tags: tag });
      const items = await Item.find({ tags: tag })
        .skip((page - 1) * limit)
        .limit(limit);
      return { items, totalItems };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async addBrand(brand) {
    try {
      const newBrand = await Brand.create(brand);
      newBrand.save();
      return newBrand;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getItemsByCategory(category, page = 1, limit = 12) {
    try {
      const totalItems = await Item.find({ category: category });
      const items = await Item.find({ category: category })
        .skip((page - 1) * limit)
        .limit(limit);
      return { items, totalItems };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getBrands() {
    try {
      const brands = await Brand.find();
      return brands;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getFilteredItems(filters, page = 1, limit = 12) {
    try {
      const { tags, category, brand, sort, seller } = filters;
      // console.log(filters);
      const filter = {};
      if (tags.length > 0) {
        filter.tags = tags;
      }
      if (category.length > 0) {
        filter.categories = category;
      }
      if (brand.length > 0) {
        filter.brand = brand;
      }
      if (seller.length > 0) {
        filter.seller = seller;
      }
      if (Object.keys(filter).length === 0) {
        const totalItems = await Item.find({});
        const items = await Item.find({})
          .skip((page - 1) * limit)
          .limit(limit);

        if (sort.length > 0) {
          const sortedItems = items.sort((a, b) => {
            if (sort === "asc") {
              return a.price - b.price;
            } else if (sort === "desc") {
              return b.price - a.price;
            } else if (sort === "date") {
              return a.createdAt - b.createdAt;
            }
          });
          return { items: sortedItems, totalItems: totalItems.length };
        }
        return { items, totalItems: totalItems.length };
      }
      const totalItems = await Item.find({
        $or: [
          {
            $or: [
              { tags: { $in: tags } },
              { categories: { $in: category } },
              { brand: { $in: brand } },
              { seller: { $in: seller ? seller : null } },
            ],
          },
        ],
      });
      const items = await Item.find({
        $or: [
          {
            $or: [
              { tags: { $in: tags } },
              { categories: { $in: category } },
              { brand: { $in: brand } },
              { seller: { $in: seller ? seller : null } },
            ],
          },
        ],
      })
        .skip((page - 1) * limit)
        .limit(limit);

      if (sort.length > 0) {
        // console.log(items, 'sort');
        const sortedItems = items.sort((a, b) => {
          if (sort === "asc") {
            return a.price - b.price;
          } else if (sort === "desc") {
            return b.price - a.price;
          }
        });
        return { items: sortedItems, totalItems: totalItems.length };
      }
      return { items, totalItems: totalItems.length };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getBasketItems(items) {
    const responseItems = await Item.find({ _id: { $in: items } });
    return responseItems;
  }
}

// module.exports = new ItemService();
export default new ItemService();

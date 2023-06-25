// const User = require("../models/User");
// const bcrypt = require("bcrypt");
// const jsonwebtoken = require("jsonwebtoken");
// const { SECRET } = require("../config");
// const EmailSender = require("../utils/sendEmail");
// const axios = require("axios");
// const DeliveryData = require("../models/DeliveryData");

import User from "../models/User.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { SECRET } from "../config/index.js";
import EmailSender from "../utils/sendEmail.js";
import axios from "axios";
import DeliveryData from "../models/DeliveryData.js";

const MailMessage = (code) => {
  return (
    "<html><head></head><body><h1 style='color: red'>" +
    code +
    "</h1></body></html>"
  );
};

const generateAccessToken = (id, role, user) => {
  const payload = {
    id,
    role,
    user,
  };
  return jsonwebtoken.sign(payload, SECRET, { expiresIn: "24h" });
};

class authService {
  async sendCode(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      const code = user.activationCode;
      EmailSender.sendEmail(email, "Activation Code", code);
      return res.status(200).json({ message: "Code sent" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: "send code error" });
    }
  }

  async register(req, res) {
    try {
      const data = req.body;
      const emailCondidate = await User.findOne({ email: data.email });
      const phoneCondidate = await User.findOne({ phone: data.phone });
      if (emailCondidate || phoneCondidate) {
        if (emailCondidate.isActivated) {
          return res.status(400).json({ message: "Account already exists" });
        } else {
          return res.status(205).json({ message: "Activate your account" });
        }
      }
      const user = new User({
        name: data.name,
        phone: data.phone,
        email: data.email,
        role: "USER",
      });
      await user.save();
      return res.status(200).json({ message: user });
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: "register error" });
    }
  }

  async checkActivationCode(req, res) {
    try {
      const { activationCode, email } = req.body;
      const user = await User.findOne({ email });
      console.log(user);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      if (user.activationCode == activationCode) {
        user.isActivated = true;
        await user.save();
        return res.status(200).json({ message: "Code is correct" });
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: "check activation code error" });
    }
  }

  async continueRegister(req, res) {
    try {
      const { password, email } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        if (!user.isActivated) {
          return res.status(403).json({ message: "Account is not activated" });
        }
      }
      const hashPassword = await bcrypt.hash(password, 7);
      user.password = hashPassword;
      await user.save();
      return res
        .status(200)
        .json({ message: "User password saved", hash: hashPassword });
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: "adding password error" });
    }
  }

  async login(req, res) {
    try {
      const { userLogin, password } = req.body;
      const user =
        (await User.findOne({ email: userLogin })) ||
        (await User.findOne({ phone: userLogin }));
      console.log(user);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Invalid password" });
      }
      const token = generateAccessToken(user._id, user.role, user);

      res.status(200).json({ token, user: user._id });
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: "Login error" });
    }
  }

  async checkToken(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jsonwebtoken.verify(token, SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      const deliveryData = await DeliveryData.findById(user.deliveryData);
      if (!deliveryData) {
        return res.json(user);
      }
      return res.json({
        ...user._doc,
        deliveryData,
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: "check token error" });
    }
  }

  async getUser(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jsonwebtoken.verify(token, SECRET);
      const user = await User.findById(decoded.id);
      const deliveryData = await DeliveryData.findById(user.deliveryData);
      if (!deliveryData) {
        return res.json(user);
      }
      return res.json({
        ...user._doc,
        deliveryData,
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: "get user error" });
    }
  }

  async getUserByID(req, res, next) {
    try {
      const user = await User.findById(req.params.id);
      res.json(user);
    } catch (e) {
      console.log(e);
      next();
    }
  }

  async googleAuth(response) {
    const data = response.response;
    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${data.access_token}` },
      }
    );
    const condidate = await User.findOne({ email: userInfo.data.email });
    if (!condidate) {
      const user = new User({
        email: userInfo.data.email,
        // phone: "",
        // password: "",
        isActivated: true,
        role: "USER",
        connectionType: "google",
      });
      await user.save();

      const token = generateAccessToken(user._id, "USER", user);
      return { token: token, status: 200 };
    }
    if (condidate.connectionType != "google") {
      return {
        error: "This email is already registered with another account",
        status: 400,
      };
    }
    const token = generateAccessToken(condidate._id);
    return { token: token, status: 200 };
  }

  async updateDelivery(data) {
    const { id, country, phone, city, zipCode, address } = data;
    const condidate = await User.findById(id);
    const deliveryCondidate = await DeliveryData.findById(
      condidate?.deliveryData
    );
    if (!deliveryCondidate) {
      const deliveryData = new DeliveryData({
        country,
        phone,
        city,
        zipCode,
        address,
      });
      await deliveryData.save();
      condidate.deliveryData = deliveryData._id;
      await condidate.save();
      return { status: 200, message: "Delivery data updated" };
    }
    deliveryCondidate.country = country;
    deliveryCondidate.phone = phone;
    deliveryCondidate.city = city;
    deliveryCondidate.zipCode = zipCode;
    deliveryCondidate.address = address;
    await deliveryCondidate.save();
    return { status: 200, message: "Delivery data updated" };
  }

  async updateUser(data) {
    const { id, name, surname, phone } = data;
    const user = await User.findById(id);

    if (!user) {
      return { status: 400, message: "User not found" };
    }

    const condidate = await User.findOne({ phone });
    if (condidate && condidate._id != id) {
      return { status: 400, message: "Phone is already registered" };
    }
    user.name = name + " " + surname;
    user.phone = phone;

    await user.save();

    return { status: 200, message: "User updated" };
  }
}

// module.exports = new authService();
export default new authService();

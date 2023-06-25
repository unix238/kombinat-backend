import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import config from "./config/index.js";

import AuthRouter from "./routers/auth-router.js";
import NewsRouter from "./routers/news-router.js";
import ItemRouter from "./routers/item-router.js";
import PaymentRouter from "./routers/payment-router.js";

// import CMSAuthRouter from "./routers/cms/auth-router.js";
// import CMSOrdersRouter from "./routers/cms/orders-router.js";
// import CMSItemRouter from "./routers/cms/item-router.js";

import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import session from "express-session";
import MongoStoreFactory from "connect-mongo";
import * as AdminJSMongoose from "@adminjs/mongoose";
import Models from "./models/Models.js";

const app = express();
process.setMaxListeners(0);

// config
app.use(cors());

// app.use(bodyParser.json({ limit: "50mb", extended: true }));
// app.use(
//   bodyParser.urlencoded({
//     limit: "50mb",
//     extended: true,
//     parameterLimit: 50000,
//   })
// );
app.use(express.json());

// Routers
app.use("/auth", AuthRouter);
app.use("/news", NewsRouter);
app.use("/items", ItemRouter);
app.use("/payments", PaymentRouter);
app.use("/uploads", express.static("uploads"));
//CMS Routers
// app.use("/cms/auth", CMSAuthRouter);
// app.use("/cms/orders", CMSOrdersRouter);
// app.use("/cms/items", CMSItemRouter);

const start = async () => {
  try {
    const admin = await startAdmin();
    console.log(
      `AdminJS started on http://localhost:${config.PORT}${admin.options.rootPath}`
    );
    connectToDatabase();
    app.listen(config.PORT, () => {
      console.log(`app started on port ${config.PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

const connectToDatabase = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(config.DB_URL);
    console.log("connected to database");
  } catch (e) {
    console.log("Error connecting to MongoDB");
    console.log(e);
    console.log("----------------------------");
  }
};

const startAdmin = async () => {
  const DEFAULT_ADMIN = {
    email: "admin@example.com",
    password: "password",
  };
  AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
  });
  const adminOptions = {
    // We pass Category to `resources`
    resources: [...Models],
  };
  const admin = new AdminJS({
    ...adminOptions,
    rootPath: "/admin",
  });
  const authenticate = async (email, password) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      return Promise.resolve(DEFAULT_ADMIN);
    }
    return null;
  };

  const MongoStore = new MongoStoreFactory({
    ...session,
    mongoUrl: config.DB_URL,
  });
  const sessionStore = MongoStore;

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: "adminjs",
      cookiePassword: "sessionsecret",
    },
    null,
    {
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: "sessionsecret",
      cookie: {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      },
      name: "adminjs",
    }
  );

  app.use(admin.options.rootPath, adminRouter);
  return admin;
};

start();

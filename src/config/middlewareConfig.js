import express from "express";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { DB_URL } from "../utils.js";
import __dirname from "../utils.js";
import Handlebars from "../utils/handlebarsHelp.js";
import initializePassport from "./passportConfig.js";

export const middlewareConfig = (app) => {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.engine("handlebars", handlebars.engine({
      Handlebars,
      runtimeOptions: {
          allowProtoPropertiesByDefault: true,
          allowProtoMethodsByDefault: true,
      },
  }));
    app.set("view engine", "handlebars");
    app.set("views", __dirname + "/views");
    app.use(express.static(__dirname + "/public"));
    app.use(cookieParser());
  
    app.use(
      session({
        store: new MongoStore({
          mongoUrl: DB_URL,
          ttl: 3600,
        }),
        secret: process.env.SECRET_JWT, 
        resave: false,
        saveUninitialized: false,
      })
    );
  
    initializePassport();
    app.use(passport.initialize());
    app.use(passport.session());
  };

import express from "express"
import 'dotenv/config.js';
import { MongoClient } from "mongodb"
console.log(process.env.MONGO_URL);
export const client = new MongoClient(process.env.MONGO_URL);
export const dbname = "scholarship"

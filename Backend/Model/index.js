import express from "express"
import 'dotenv/config.js';
import { MongoClient } from "mongodb"
export const client = new MongoClient(process.env.MONGO_URL)
export const dbname = "scholarship"

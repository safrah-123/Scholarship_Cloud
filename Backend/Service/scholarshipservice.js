import { client, dbname } from "../Model/index.js";
const add = async (req, res) => {
  try {
    await client.connect();
    let db = client.db(dbname);
    let { scholarshipName,shortinfo, scholarInfo, income, ten, twelve, date } = req.body;
    await db.collection("scholarship").insertOne({
      scholarshipName,
      shortinfo,
      scholarInfo,
      income,
      ten,
      twelve,
      date,
    });
    res.status(200).send({
      message: "Scholarship details added successfully",
    });
  } catch (err) {
    res.status(500).send({
      message: "Something went wrong",
      err: err.message,
    });
  }
};
const get_details = async (req, res) => {
  try {
    await client.connect();
    let db = client.db(dbname);
    let { scholarshipName } = req.query;
    let data = await db
      .collection("scholarship")
      .find({ scholarshipName: scholarshipName })
      .toArray();
    res.status(200).send({
      message: "Data fetched successfully",
      data,
    });
  } catch (err) {
    res.status(500).send({
      message: "Please try again later",
      err: err.message,
    });
  }
};
const get_scholar = async (req, res) => {
  try {
    await client.connect();
    let db = client.db(dbname);

    let data = await db.collection("scholarship").find().toArray();

    res.status(200).send({
      message: "Data fetched successfully",
      payload: data,
    });
  } catch (err) {
    res.status(500).send({
      message: "Please try again later",
      err: err.message,
    });
  }
};
const delete1 = async (req, res) => {
  try {
    await client.connect();
    let db = client.db(dbname);
    let { scholarshipName } = req.body;
    let data = await db
      .collection("scholarship")
      .findOne({ scholarshipName: scholarshipName });
    if (!data) {
      res.status(400).send({
        message: "No data found",
      });
      return;
    }
    await db.collection("scholarship").deleteOne({
      scholarshipName: scholarshipName,
    });
    res.status(200).send({
      message: "Scholarship deleted successfully",
    });
  } catch (err) {
    res.status(500).send({
      message: "Something went wrong",
      err: err.message,
    });
  }
};
export default {
  add,
  delete1,
  get_details,
  get_scholar,
};

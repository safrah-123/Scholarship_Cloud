import { client, dbname } from "../Model/index.js";
import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import 'dotenv/config.js';
const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const key = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_CONTAINER_NAME;
const sharedKeyCredential = new StorageSharedKeyCredential(account, key);
const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  sharedKeyCredential
);
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
      data:data,
        income: data[0].income,
        ten: data[0].ten,
        twelve: data[0].twelve,
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
       data: data
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
const uploadBase64ToAzure = async (base64String, email, type) => {
  if (!base64String) return null;
  const extension = ".pdf"; 

  const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return null;

  const buffer = Buffer.from(matches[2], "base64");
  const fileName = `${email}-${type}${extension}`;

  const blobClient = blobServiceClient
    .getContainerClient(containerName)
    .getBlockBlobClient(fileName);

  await blobClient.uploadData(buffer);
  return blobClient.url;
};

const submit_application = async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbname);
    const { scholarName, email,name, age, dob, district, documents } = req.body;
const incomeUrl = await uploadBase64ToAzure(documents?.income, email, "income");
const tenthUrl = await uploadBase64ToAzure(documents?.tenth, email, "tenth");
const twelfthUrl = await uploadBase64ToAzure(documents?.twelfth, email, "twelfth");
    await db.collection("scholarApplications").insertOne({
      scholarName,
      email,
      name,
      age,
      dob,
      district,
      documents: {
        income: incomeUrl,
        tenth: tenthUrl,
        twelfth: twelfthUrl
      },
      appliedAt: new Date(),
      status: "Pending"
    });

    res.status(200).send({ message: "Application submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error submitting application", error: err.message });
  }
};
const get_application=async(req,res)=>{
  try{
       await client.connect();
       let db=client.db(dbname);
       let {name}=req.query;
       let data=await db.collection("scholarApplications").find({name:name}).toArray();
       res.status(200).send({
        message:"Data fetched Sucessfully",
        data
       })
  }
  catch(err){
    res.status(400).send(
      {
        message:"Please try again later",
        err:err.message
      }
    )
  }
}
const delete_application = async (req, res) => {
  try {
    await client.connect();
    let db = client.db(dbname);
    let { name,scholarName } = req.query;
    let data = await db
      .collection("scholarApplications")
      .findOne({name:name,scholarName:scholarName });
    if (!data) {
      res.status(400).send({
        message: "No data found",
      });
      return;
    }
    await db.collection("scholarApplications").deleteOne({
    name:name,scholarName:scholarName
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
const get_application1=async(req,res)=>{
  try{
       await client.connect();
       let db=client.db(dbname);
       let data=await db.collection("scholarApplications").find().toArray();
       res.status(200).send({
        message:"Data fetched Sucessfully",
        data
       })
  }
  catch(err){
    res.status(400).send(
      {
        message:"Please try again later",
        err:err.message
      }
    )
  }
}
const check_scholar=async(req,res)=>{
let {scholarName,email}=req.query;
try{
   await client.connect();
    let db = client.db(dbname);
    let { name,scholarName } = req.query;
    let data = await db
      .collection("scholarApplications")
      .findOne({name:name,scholarName:scholarName });
      if(data){
        res.status(200).send({
          message:"0"
        })
      }
      else{
       res.status(200).send({
          message:"1"
        })
      }
}
catch(err){
  res.status(500).send({
    message:"Something went wrong",
    err:err.message
  })
}
}



export default {
  add,
  delete1,
  get_details,
  get_scholar,
  submit_application,
  get_application,
  delete_application,
  check_scholar,
  get_application1
};

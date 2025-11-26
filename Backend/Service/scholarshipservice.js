import { client, dbname } from "../Model/index.js";
import { BlobServiceClient, StorageSharedKeyCredential, BlobClient } from "@azure/storage-blob";
import { DocumentAnalysisClient, AzureKeyCredential } from "@azure/ai-form-recognizer";   
import nodemailer from "nodemailer";
import 'dotenv/config.js';
const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const key = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_CONTAINER_NAME;
const sharedKeyCredential = new StorageSharedKeyCredential(account, key);
const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  sharedKeyCredential
);
const diClient = new DocumentAnalysisClient(
  process.env.AZURE_DI_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_DI_KEY)
);
async function downloadBlobToBuffer(blobUrl) {
  if (!blobUrl) return null;
  const blobClient = new BlobClient(blobUrl, sharedKeyCredential); // private read using Access Key
  const resp = await blobClient.download();
  const chunks = [];
  for await (const c of resp.readableStreamBody) chunks.push(c);
  return Buffer.concat(chunks);
}
async function analyzeBuffer(buffer) {
  if (!buffer) return { text: "", kvPairs: [] };
  try {
    const poller = await diClient.beginAnalyzeDocument("prebuilt-document", buffer);
    const result = await poller.pollUntilDone();
    const text = result.content ?? "";
    const kvPairs = [];

    for (const d of result.documents ?? []) {
      for (const k of Object.keys(d.fields ?? {})) {
        kvPairs.push({ key: k, value: d.fields[k]?.content ?? "" });
      }
    }
    for (const kv of result.keyValuePairs ?? []) {
      kvPairs.push({ key: kv.key?.content ?? "", value: kv.value?.content ?? "" });
    }
    return { text, kvPairs };
  } catch {
    const poller = await diClient.beginAnalyzeDocument("prebuilt-read", buffer);
    const result = await poller.pollUntilDone();
    return { text: result.content ?? "", kvPairs: [] };
  }
}

function extractIncomeAmount({ text, kvPairs }) {
  const sources = [
    ...kvPairs.filter(kv => /(income|annual)/i.test(kv.key || "")).map(kv => kv.value),
    text,
  ];
  const patterns = [
    /(?:rs\.?|rupees|₹)\s*[:\-]?\s*([0-9][0-9,]{3,})\b/gi,
    /([0-9][0-9,]{3,})\s*\/?\s*(?:per\s*)?annum/gi,
    /\bincome\s*[:\-]?\s*(₹?\s*[0-9][0-9,]{3,})/gi,
  ];
  for (const s of sources) {
    if (!s) continue;
    for (const re of patterns) {
      re.lastIndex = 0;
      const m = re.exec(s);
      if (m) {
        const digits = (m[1] || "").replace(/[^\d]/g, "");
        if (digits) return Number(digits);
      }
    }
  }
  return null;
}
function extractTotalMarks({ text, kvPairs }) {
  const candidates = [...kvPairs.map(kv => `${kv.key} ${kv.value}`), text];
  const totals = [];
  const totalRe = /TOTAL\s+MARKS?\s*[:\-]?\s*([0-9]{2,4})/gi;
  for (const src of candidates) {
    if (!src) continue;
    totalRe.lastIndex = 0;
    let m;
    while ((m = totalRe.exec(src))) {
      const n = Number(m[1]);
      if (!Number.isNaN(n)) totals.push(n);
    }
  }
  if (totals.length) return Math.max(...totals);

  const wordTrail = /\b([1-9][0-9]{2,3})\b(?:\s+(?:ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE|ZERO))+?/gi;
  for (const src of candidates) {
    if (!src) continue;
    wordTrail.lastIndex = 0;
    const m = wordTrail.exec(src);
    if (m) return Number(m[1]);
  }
  return null;
}

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
  const matches = base64String.match(/^data:([A-Za-z0-9/+.-]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return null;

  const contentType = matches[1]; 
  const buffer = Buffer.from(matches[2], "base64");
  const safeEmail = String(email).replace(/[^a-z0-9@.-]/gi, "_");
  const extension = contentType.includes("pdf") ? ".pdf" : ".bin";
  const uniqueSuffix = Date.now();
  const fileName = `${safeEmail}-${type}-${uniqueSuffix}${extension}`;
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlockBlobClient(fileName);
  await blobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: contentType || "application/octet-stream" },
  });
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
     let incomeAmount = null, tenthTotal = null, twelfthTotal = null;
    const [bufIncome, buf10, buf12] = await Promise.all([
      incomeUrl  ? downloadBlobToBuffer(incomeUrl)  : Promise.resolve(null),
      tenthUrl   ? downloadBlobToBuffer(tenthUrl)   : Promise.resolve(null),
      twelfthUrl ? downloadBlobToBuffer(twelfthUrl) : Promise.resolve(null),
    ]);

    if (bufIncome) {
      const a = await analyzeBuffer(bufIncome);
      incomeAmount = extractIncomeAmount(a);
    }
    if (buf10) {
      const a = await analyzeBuffer(buf10);
      tenthTotal = extractTotalMarks(a);
    }
    if (buf12) {
      const a = await analyzeBuffer(buf12);
      twelfthTotal = extractTotalMarks(a);
    }
    console.log("----------- Scholarship Extraction -----------");
    console.log(`Applicant: ${name} | Scholarship: ${scholarName}`);
    console.log(`Income (annual): ${incomeAmount ?? "NOT FOUND"}`);
    console.log(`10th Total Marks: ${tenthTotal ?? "NOT FOUND"}`);
    console.log(`12th Total Marks: ${twelfthTotal ?? "NOT FOUND"}`);
    console.log("----------------------------------------------");
     let result = "Rejected";

 
    const tenthPercent = tenthTotal ? (tenthTotal / 500) * 100 : 0;
    const twelfthPercent = twelfthTotal ? (twelfthTotal / 1200) * 100 : 0;

    if (
      incomeAmount !== null && incomeAmount < 100000 &&
      tenthPercent > 60 &&
      twelfthPercent > 70
    ) {
      result = "Accepted";
    }

    console.log(`Final Result: ${result}`);
 
    await db.collection("scholarApplications").updateOne(
      { email, name, scholarName },
      {
        $set: {
          "extracted.income.amount": incomeAmount,
          "extracted.tenth.total": tenthTotal,
          "extracted.twelfth.total": twelfthTotal,
          "extracted.tenth.percent": tenthPercent,
          "extracted.twelfth.percent": twelfthPercent,
          result,
          lastAnalyzedAt: new Date(),
        },
      }
    );
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
    let { email, name, scholarName } = req.query;

    console.log("Deleting application for:", email, "Scholarship:", scholarName);
    const data = await db
      .collection("scholarApplications")
      .findOne({ email, scholarName });
    if (!data) {
      return res.status(400).send({ message: "No data found" });
    }
    await db.collection("scholarApplications").deleteOne({ email, scholarName });
    if (name === "admin") {
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.GMAIL_USER || "azsafrah@gmail.com",
            pass: process.env.GMAIL_PASS || "ugde rvgk yxwa ywbp",
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        const mailOptions = {
          from: `"Scholarship Portal" <${process.env.GMAIL_USER || "azsafrah@gmail.com"}>`,
          to: email,
          subject: "Scholarship Application Status",
          text:
            "Dear Applicant,\n\n" +
            "We regret to inform you that your scholarship application has been rejected. " +
            "For more details, please contact our support team.\n\n" +
            "Regards,\nScholarship Department",
        };

        await transporter.sendMail(mailOptions);
        console.log(`Rejection email sent successfully to ${email}`);
      } catch (mailErr) {
        console.error("Error sending mail:", mailErr.message);
      }
    }
    res.status(200).send({
      message: "Application deleted successfully",
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).send({
      message: "Something went wrong",
      err: err.message,
    });
  }
};
const accept_application = async (req, res) => {
  try {
    await client.connect();
    let db = client.db(dbname);
    let { email, name, scholarName } = req.body;

    console.log("Updating application status for:", email, "Scholarship:", scholarName);

    const data = await db
      .collection("scholarApplications")
      .findOne({ email, scholarName });

    if (!data) {
      return res.status(400).send({ message: "No data found" });
    }
    await db.collection("scholarApplications").updateOne(
      { email, scholarName },
      { $set: { status: "accepted" } }
    );

    console.log(`Status updated to 'accepted' for ${email}`);

    if (name === "admin") {
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.GMAIL_USER || "azsafrah@gmail.com",
            pass: process.env.GMAIL_PASS || "ugde rvgk yxwa ywbp",
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        const mailOptions = {
          from: `"Scholarship Portal" <${process.env.GMAIL_USER || "azsafrah@gmail.com"}>`,
          to: email,
          subject: "Scholarship Application Status",
          text:
            "Dear Applicant,\n\n" +
            "Congratulations! Your scholarship application has been accepted. " +
            "Please check your dashboard for more details.\n\n" +
            "Regards,\nScholarship Department",
        };

        await transporter.sendMail(mailOptions);
        console.log(`Acceptance email sent successfully to ${email}`);
      } catch (mailErr) {
        console.error("Error sending mail:", mailErr.message);
      }
    }
    res.status(200).send({
      message: "Application status updated to accepted successfully",
    });
  } catch (err) {
    console.error("Error:", err.message);
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
  accept_application,
  check_scholar,
  get_application1
};

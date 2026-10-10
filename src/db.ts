// Student Name: Kelsey Richards
// Date: 9/25/2026

// function to connect to the MongoDB database and return the database instance
import { Db, MongoClient } from "mongodb";
import { Issue } from "./data/issues.js";

let db: Db;

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }

  const client = new MongoClient(uri);

  await client.connect();

  db = client.db("issueTracker");

  // Creates an index for filtering by status and sorting by date
  await db.collection("issues").createIndex({ status: 1, createdOn: -1 });

  return db;
}

export function getIssuesCollection() {
  return db.collection<Issue>("issues");
}

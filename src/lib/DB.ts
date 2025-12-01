import mongoose from "mongoose";

const mongsDbUrl = process.env.MONGDB_URL

if(!mongsDbUrl){
  throw new Error("Db error");

}

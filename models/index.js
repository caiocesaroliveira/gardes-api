import mongoose from "mongoose"

const db = {}
db.mongoose = mongoose
db.url = process.env.MONGO_URL

export { db }

import { db } from "./index.js"

const GradeSchema = new db.mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  subject: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  value: {
    type: Number,
    require: true,
  },
  lastModified: {
    type: Date,
    require: true,
  },
})

const Grade = db.mongoose.model("Grade", GradeSchema, "grades")

export default Grade

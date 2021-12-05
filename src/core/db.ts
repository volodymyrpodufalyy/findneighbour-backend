import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/find-neighbor", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

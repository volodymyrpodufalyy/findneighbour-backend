import mongoose from "mongoose";

mongoose.connect(
  `mongodb+srv://propositumMember:${process.env.GMAIL_PASS}@propositum.tqzzi.mongodb.net/findNeighbour?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);

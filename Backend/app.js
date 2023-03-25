const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const router = require("./routes/user-routes");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const mongoose = require("mongoose");

const app = express();
app.use(cors({ credentials:true, origin:"http://localhost:3000", useSuccessStatus: 200 }));
app.use(cookieParser());

app.use(express.json());

app.use("/api", router);

mongoose.set("strictQuery", false);
// Database
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("database connected successfully"))
  .catch((err) => console.log("error connecting to mongodb", err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is runnig on port ${PORT}...`);
});

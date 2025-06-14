import express from "express";
import "dotenv/config";
import { initDB } from "./config/initDB.js";
import transactionsRoute from "./routes/transactionsRoute.js";

const app = express();

const PORT = process.env.PORT || 3001;


app.use(express.json());
app.set('trust proxy', true);
app.use("/api/transactions", transactionsRoute);
app.get('/', (req, res)=>{
  res.json("api Is working 123@")
})
// Initialize database and start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
  });
});

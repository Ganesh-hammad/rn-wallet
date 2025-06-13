import express from "express";
import "dotenv/config";
import { initDB } from "./config/initDB.js";
import transactionsRoute from "./routes/transactionsRoute.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/', (req, res)=>{
  res.json("api Is working")
})
app.use(express.json());
app.use("/api/transactions", transactionsRoute);

// Initialize database and start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
  });
});

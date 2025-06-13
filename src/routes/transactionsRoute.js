import express from 'express'
import { createTransactions, deleteTransactions, getTransactions, transactionSummary } from '../controllers/transactionController.js';
import rateLimiter from '../middleware/rateLimiter.js';


const transactionsRoute = express.Router();

transactionsRoute.use(rateLimiter);

transactionsRoute.post("/create-transaction", createTransactions);
transactionsRoute.get("/get-transactions/:userId", getTransactions);
transactionsRoute.delete("/delete-Transactions/:id", deleteTransactions);
transactionsRoute.get("/summary/:userId", transactionSummary);

export default transactionsRoute;
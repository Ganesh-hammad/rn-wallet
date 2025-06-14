import { sql } from "../config/db.js";


const createTransactions = async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || !amount || !category || !user_id) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const transaction = await sql`
    INSERT INTO transactions(user_id,title,amount,category)
    VALUES(${user_id},${title},${amount},${category})
    RETURNING *`;
    console.log(transaction);
    res.status(201).json({ success: true, transaction: transaction[0] });
  } catch (error) {
    console.log("Transaction creation Error" + error);
    res.status(500).json({ success: false, message: error.message });
  }
}

const getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await sql`
    SELECT * FROM transactions where user_id  = ${userId} ORDER BY created_at DESC`;
    res.status(200).json({ success: true, transactions })
  } catch (error) {
    console.log("Getting Transaction Error" + error);
    res.status(500).json({ success: false, message: error.message });
  }
}
const deleteTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res
        .status(400)
        .json({ success: false, message: "invalid transaction" });
    }
    const deletedId = await sql`
    DELETE FROM transactions WHERE id = ${id} RETURNING *`;
    if (deletedId.length === 0) {
      res
        .status(404)
        .json({ success: false, message: "Transaction Not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Transaction Deleted successfully" });
  } catch (error) {
    console.log("Deleting Transaction Error" + error);
    res.status(500).json({ success: false, message: error.message });
  }
}

const transactionSummary = async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance
      FROM transactions WHERE user_id = ${userId}`;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income
      FROM transactions WHERE user_id = ${userId} AND amount > 0`;

    const expenseResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expenses
      FROM transactions WHERE user_id = ${userId} AND amount < 0`;

    res.status(200).json({
      success: true,
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expenseResult[0].expenses, // matching frontend key
    });
  } catch (error) {
    console.log("Error getting summary: " + error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {createTransactions, getTransactions, deleteTransactions, transactionSummary}
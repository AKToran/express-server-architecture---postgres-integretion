import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";

const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString:
    "",
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(20),
      email VARCHAR(30) UNIQUE NOT NULL,
      password VARCHAR(20) NOT NULL,
      is_active BOOLEAN DEFAULT true,
      age INT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `);
    console.log("Database connected successfully.");
  } catch (error) {
    console.log(error);
  }
};

initDB();

app.get("/", (req: Request, res: Response) => {
  // res.send('Hello World!');
  res.status(200).json({
    success: true,
    message: "Express server.",
    author: "Abid",
  });
});

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM USERS
      `);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully.",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.get("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT * FROM users WHERE id=$1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found.",
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully.",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.post("/api/users", async (req: Request, res: Response) => {
  const { name, email, password, age } = req.body;

  try {
    const result = await pool.query(
      `
    INSERT INTO users(name, email, password, age) 
    VALUES($1,$2,$3,$4)
    RETURNING *
    `,
      [name, email, password, age],
    );

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

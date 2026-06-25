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
  connectionString : ""
})

app.get("/", (req: Request, res: Response) => {
  // res.send('Hello World!');
  res.status(200).json({
    message: "Express server.",
    author: "Abid",
  });
});

app.post("/", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  res.status(201).json({
    message: "Created",
    data: {
      name,
      email,
    },
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

import express from "express";
import { Request, Response } from "express";
import { myDataSource } from "./.database/pg/db";
import User from "./.entities/user.entity";
import "reflect-metadata";

// create and setup express app
const app = express();
app.use(express.json());

myDataSource
  .initialize()
  .then(() => {
    console.log("\n💫 DB Connected 💫\n");
  })
  .catch((err) => {
    console.error("\n❌Error during DB initialization:", err);
  });

// register routes
app.get("/", (_: Request, res: Response) => {
  res.send("Hello from server!");
});

app.get("/users", async function (req: Request, res: Response) {
  console.log("->", process.cwd());
  console.log(myDataSource.options.entities);
  try {
    const users = await myDataSource.getRepository(User).find();
    res.json(users);
  } catch (error) {
    res.status(500).send("Error Occured");
  }
});

app.get("/users/:id", function (req: Request, res: Response) {
  // here we will have logic to return user by id
});

app.post("/users", function (req: Request, res: Response) {
  // here we will have logic to save a user
});

app.put("/users/:id", function (req: Request, res: Response) {
  // here we will have logic to update a user by a given user id
});

app.delete("/users/:id", function (req: Request, res: Response) {
  // here we will have logic to delete a user by a given user id
});

// start express server
app.listen(3000);

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  fs.readdir(`./files`, (err, files) => {
    res.render("index", { files: files });
  });
});

app.get("/file/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, fileData) => {
    res.render("show", { filename: req.params.filename, fileData: fileData });
  });
});

app.get("/edit/:filename", (req, res) => {
  res.render("edit", { filename: req.params.filename });
});

app.post("/create", (req, res) => {
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("").toLowerCase()}.txt`,
    req.body.details,
    (err) => {
      res.redirect("/");
    }
  );
});

app.post("/edit", (req, res) => {
  fs.rename(
    `./files/${req.body.previous}`,
    `./files/${req.body.new}`,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    }
  );
});

app.listen(3000, () => {
  console.log("Server started on port : 3000");
});

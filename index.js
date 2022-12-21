const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
const { PORT } = process.env;
const app = express();
const uuid_all = require("uuid");
const uuid = uuid_all.v4;
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));
app.use(helmet());
const JSZip = require("jszip");
const knex = require("./db/db");

var multer = require("multer");
var upload = multer();
var type = upload.single("file");
app.post("/file", type, async (req, res) => {
  if (!req.file) {
    return res.status(400).send({
      detail: [
        {
          message: '"file" is required',
          path: ["file"],
          type: "any.required",
          context: {
            label: "file",
            key: "file",
          },
        },
      ],
    });
  }
  if (req.file.buffer.length > 5 * 1024 * 1024) {
    return res.status(400).send({
      detail: [
        {
          message: "the file size is too large",
          path: ["file"],
          success: false,
        },
      ],
    });
  }

  let { originalname, mimetype } = req.file;
  const zip = new JSZip();
  zip.file(originalname, req.file.buffer, { binary: true });
  zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }).then(
    async function callback(buffer) {
      const id = uuid();
      if (!/^[a-z0-9-&() +'.,?;@%]{1,}$/i.test(originalname)) originalname = id;
      await knex("files")
        .insert(
          {
            file_uuid: id,
            name: new Date().getTime() + "_" + originalname,
            type: mimetype,
          },
          "*"
        )
        .then(async () => {
          let arrayfuffer = [];
          for (let i = 0; i < buffer.length / 262144; i++) {
            if (i < buffer.length / 262144 - 1)
              arrayfuffer.push({
                chunk: buffer.slice(262144 * i, (i + 1) * 262144),
                file_uuid: id,
              });
            else
              arrayfuffer.push({
                chunk: buffer.slice(262144 * i, buffer.length),
                file_uuid: id,
              });
          }
          await knex("file_chunk")
            .insert(arrayfuffer, "*")
            .then(() => {
              res.json({ success: true, uuid: id, name: originalname });
            })
            .catch((err) => {
              console.log(err);
              res.status(400).json({
                success: false,
                message: "upload failed",
                stack: err.stack,
              });
            });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({
            success: false,
            message: "upload failed",
            stack: err.stack,
          });
        });
    },
    function (e) {
      console.log(e);
      res.status(400).json({ success: false, message: "An error occurred" });
    }
  );
});

app.get("/file/:id", (req, res) => {
  knex.select("*")
    .from("files")
    .where({ file_uuid: req.params.id })
    .then((file) => {
      knex.select("*")
        .from("file_chunk")
        .where({ file_uuid: req.params.id })
        .then(async (chunks) => {
          if (chunks[0]) {
            let arr = [];
            for (let i = 0; i < chunks.length; i++)
              for (let j = 0; j < chunks[i].chunk.length; j++)
                arr.push(chunks[i].chunk[j]);
            var zip = new JSZip();
            zip.loadAsync(Buffer.from(arr)).then(function (contents) {
              Object.keys(contents.files).forEach(function (filename) {
                zip
                  .file(filename)
                  .async("nodebuffer")
                  .then(function (content) {
                    return res.type(file[0].type).send(content);
                  })
                  .catch((err) => {
                    console.log(err);
                    res
                      .status(400)
                      .json({ success: false, message: "An error occurred" });
                  });
              });
            });
          } else
            return res
              .status(400)
              .json({ success: false, message: "file does not exist" });
        })
        .catch((err) => {
          console.log(err);
          res
            .status(400)
            .json({ success: false, message: "An error occurred" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ success: false, message: "An error occurred" });
    });
});

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});

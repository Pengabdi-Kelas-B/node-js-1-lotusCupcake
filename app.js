const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = {};

app.makeFolder = () => {
  rl.question("Masukan nama folder : ", (folderName) => {
    fs.mkdir(__dirname + `/${folderName}`, (err) => {
      if (!err) {
        console.log("success created new folder");
      } else {
        console.log("failed created new folder");
      }
    });
    rl.close();
  });
};

app.makeFile = () => {
  rl.question(
    "Masukan nama file (hanya mendukung .txt dan .md) : ",
    (fileName) => {
      rl.question("Masukan isi file : ", (fileContent) => {
        fs.writeFile(__dirname + `/${fileName}`, fileContent, (err) => {
          if (!err) {
            console.log("success created new file");
          } else {
            console.log("failed created new file");
          }
        });
        rl.close();
      });
    }
  );
};

app.extSorter = () => {
  const folderPath = path.join(__dirname, "unorganize_folder");
  const textFolder = path.join(__dirname, "text");
  const imageFolder = path.join(__dirname, "image");

  if (!fs.existsSync(textFolder)) {
    fs.mkdirSync(textFolder);
  }

  if (!fs.existsSync(imageFolder)) {
    fs.mkdirSync(imageFolder);
  }

  const files = fs.readdirSync(folderPath);

  if (files.length == 0) {
    console.log("folder is empty");
  }

  files.forEach((file) => {
    const extension = path.extname(file).toLowerCase();
    const srcPath = path.join(folderPath, file);

    let destPath = "";
    if (extension === ".txt" || extension === ".md") {
      destPath = path.join(textFolder, file);
    } else if (extension === ".jpg" || extension === ".png") {
      destPath = path.join(imageFolder, file);
    }

    try {
      fs.renameSync(srcPath, destPath);
      console.log(`success moving file : ${file}`);
    } catch {
      console.log(`failed moving file : ${file}`);
    }
  });
  rl.close();
};

app.readFolder = () => {
  rl.question("Masukan nama folder : ", (folderName) => {
    const folderPath = path.join(__dirname, folderName);

    if (!fs.existsSync(folderPath)) {
      console.log("folder not found");
      rl.close();
      return;
    }

    const files = fs.readdirSync(folderPath);

    if (files.length == 0) {
      console.log("folder is empty");
    }

    const result = [];

    files.forEach((file) => {
      const extension = path.extname(file).toLowerCase().slice(1);
      let fileType = "not detected";
      if (extension === "txt" || extension === "md") {
        fileType = "text";
      } else if (extension === "jpg" || extension === "png") {
        fileType = "image";
      }
      result.push({
        name: file,
        extensi: extension,
        jenisFile: fileType,
        tanggalDibuat: fs.statSync(path.join(folderPath, file)).birthtime,
        ukuranFile:
          (fs.statSync(path.join(folderPath, file)).size / 1024).toFixed(2) +
          "kb",
      });
    });

    console.log(`berhasil menampilkan isi dari folder ${folderName} :`);
    console.log(JSON.stringify(result, null, 2));

    rl.close();
  });
};

app.readFile = () => {
  rl.question(
    "Masukan nama file (hanya mendukung .txt dan .md) : ",
    (fileName) => {
      const filePath = path.join(__dirname, fileName);

      if (!fs.existsSync(filePath)) {
        console.log("file not found");
        rl.close();
        return;
      }

      const extension = path.extname(fileName).slice(1);

      if (extension !== "txt" && extension !== "md") {
        console.log("not supported file type");
        rl.close();
        return;
      }

      const content = fs.readFileSync(filePath, "utf-8");

      console.log(`isi dari file ${fileName}`);
      console.log(content);
      rl.close();
    }
  );
};

module.exports = app;

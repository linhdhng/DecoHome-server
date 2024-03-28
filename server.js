require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const multer  = require('multer');
const fs = require('fs');
const Image = require("./models/Image")
connectDB();

app.use(express.json());
app.use(cors());

app.use(express.static("public"));


app.set("view engine", "ejs")

app.use("/api/users", require("./routes/api/users"));
app.use("/api/products", require("./routes/api/products"));
app.use('/api/auth', require('./routes/api/auth'))



// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Express route to handle file upload
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
      // Read the uploaded file
      const img = fs.readFileSync(req.file.path);
      // Create a new document to store in MongoDB
      const newImage = new Image({
          name: req.file.filename,
          data: img,
          contentType: req.file.mimetype
      });
      // Save the document to the database
      await newImage.save();
      // Remove the temporary file
      fs.unlinkSync(req.file.path);
      res.send('File uploaded successfully.');
  } catch (error) {
      res.status(500).send(error.message);
  }
});

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else {
    req.accepts("json");
    res.json({ message: "404 Not Found" });
  }
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

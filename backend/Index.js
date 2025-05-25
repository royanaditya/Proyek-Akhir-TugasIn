import express from "express";
import cors from "cors";
import router from "./routes/Route.js";
import "./models/RelationModel.js"; 
import cookieParser from "cookie-parser";
import dotenv from "dotenv";


dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Konfigurasi CORS agar mengizinkan domain frontend terdeploy
const corsOptions = {
 origin: [
    "https://notes-frontend-veriaw-dot-c-05-451109.ue.r.appspot.com",
    "http://localhost:5173", // Tambahkan localhost untuk pengembangan lokal
  ], // Ganti dengan URL frontend yang terdeploy
  credentials: true, // Memungkinkan penggunaan cookies
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions)); // Menggunakan opsi CORS

// Menambahkan penanganan preflight request (OPTIONS)
app.options("*", cors(corsOptions)); // Menanggapi preflight requests

app.use(express.json());
app.use(cookieParser());
app.use(router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

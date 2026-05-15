const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");


dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const clientRoutes = require("./routes/clients");
const invoiceRoutes = require("./routes/invoices");
const pdfRoutes = require("./routes/pdf");
const emailRoutes = require("./routes/email");
const aiRoutes = require("./routes/ai");
const portalRoutes = require("./routes/portal");

const app = express();

connectDB();

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Billify API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/portal", portalRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
});

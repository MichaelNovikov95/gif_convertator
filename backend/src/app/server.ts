import express from "express";
import cors from "cors";

import { videoRoutes } from "./routes/video.router";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.get("/", () => {
  console.log("checks");
});
app.use("/api/videos", videoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

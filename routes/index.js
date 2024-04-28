
import express from 'express';
const router = express.Router();
const app = express();

  app.use("/posts", postRoutes);
  app.use("/sessions", sessionRoutes);
  app.use("/users", userRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({error: 'Route Not found'});
  });


export default router;
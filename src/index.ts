import { TVideoDB } from "./types";
import express, { Request, Response } from "express";
import cors from "cors";
import { VideoDataBase } from "./database/VideoDatabase";
import { Video } from "./models/videoClass";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`);
});

app.get("/videos", async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;

    const videosDB = await new VideoDataBase().findVideo(id);

    const videos: Video[] = videosDB.map(
      (video) =>
        new Video(video.id, video.title, video.duration, video.uploud_at)
    );
    res.status(200).send(videos);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.post("/videos", async (req: Request, res: Response) => {
  try {
    const { id, title, duration } = req.body;

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'id' deve ser uma string");
    }
    if (typeof title !== "string") {
      res.status(400);
      throw new Error("'title' deve ser uma string");
    }
    if (typeof duration !== "number") {
      res.status(400);
      throw new Error("'duration' deve ser um número");
    }

    const videoDBexists: TVideoDB | undefined =
      await new VideoDataBase().findVideoById(id);

    if (videoDBexists) {
      res.status(400);
      throw new Error("Video com esse 'ID' já existe.");
    }

    const newVideo = new Video(id, title, duration, new Date().toISOString());

    const newVideoDB: TVideoDB = {
      id: newVideo.getId(),
      title: newVideo.getTitle(),
      duration: newVideo.getDuration(),
      uploud_at: newVideo.getUploudAt(),
    };

    await new VideoDataBase().insertVideo(newVideoDB);

    res.status(200).send(newVideoDB);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.put("/video/:id", async (req: Request, res: Response) => {
  try {
    const q = req.params.id as string;
    const { id, title, duration } = req.body;

    if (typeof q !== "string") {
      res.status(400);
      throw new Error("'id' deve ser uma string");
    }
    if (title) {
      if (typeof title !== "string") {
        res.status(400);
        throw new Error("'title' deve ser uma string");
      }
    }
    if (duration) {
      if (typeof duration !== "number") {
        res.status(400);
        throw new Error("'duration' deve ser um número");
      }
    }

    const videoDB: TVideoDB | undefined =
      await new VideoDataBase().findVideoByIdPut(q);

    if (!videoDB) {
      res.status(400);
      throw new Error("Id não encontrado.");
    }

    const video = new Video(
      videoDB.id,
      videoDB.title,
      videoDB.duration,
      videoDB.uploud_at
    );

    const newID = id || videoDB.id;
    const newTitle = title || videoDB.title;
    const newDuration =
      typeof duration === "number" ? duration : videoDB.duration;

    video.setId(newID);
    video.setTitle(newTitle);
    video.setDuration(newDuration);

    await new VideoDataBase().updateVideo(newID, newTitle, newDuration, q);

    res.status(200).send(video);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.delete("/videos", async (req: Request, res: Response) => {
  try {
    const q = req.query.id as string;

    if (!q) {
      res.status(400);
      throw new Error("Digite um id para query para deletar o video.");
    }

    await new VideoDataBase().deleteVideo(q);

    res.status(200).send("Video deletado com sucesso.");
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

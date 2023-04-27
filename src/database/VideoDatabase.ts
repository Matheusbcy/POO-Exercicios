import { TVideoDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class VideoDataBase extends BaseDatabase {
  public static TABLE_VIDEO = "video";

  async findVideo(id: string | undefined) {
    let videosDB;

    if (id) {
      const result: TVideoDB[] = await BaseDatabase.connection(
        VideoDataBase.TABLE_VIDEO
      ).where({ id: id });
      videosDB = result;
    } else {
      const result: TVideoDB[] = await BaseDatabase.connection(
        VideoDataBase.TABLE_VIDEO
      );
      videosDB = result;
    }
    return videosDB;
  }
  async findVideoById(id: string) {
    const [videoDBexists]: TVideoDB[] | undefined =
      await BaseDatabase.connection(VideoDataBase.TABLE_VIDEO).where({ id });
    return videoDBexists;
  }

  async insertVideo(newVideoDB: TVideoDB) {
    await BaseDatabase.connection(VideoDataBase.TABLE_VIDEO).insert(newVideoDB);
  }

  async findVideoByIdPut(id: string) {
    const [videoExistsDB]: TVideoDB[] | undefined =
      await BaseDatabase.connection(VideoDataBase.TABLE_VIDEO).where({ id });
    return videoExistsDB;
  }

  async updateVideo(
    newID: string | undefined,
    newTitle: string | undefined,
    newDuration: number | undefined,
    id: string
  ) {
    await BaseDatabase.connection(VideoDataBase.TABLE_VIDEO)
      .update({ id: newID, title: newTitle, duration: newDuration })
      .where({ id });
  }

  async deleteVideo(id: string) {
    await BaseDatabase.connection(VideoDataBase.TABLE_VIDEO)
      .where({ id })
      .del();
  }
}

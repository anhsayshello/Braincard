import { Response } from "express";
export default function unknownEndpoint(res: Response<{ error: string }>) {
  res.status(404).send({ error: "unknown endpoint" });
}

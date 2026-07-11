import { Request, Response } from "express";
import RecommendedService from "../models/RecommendedServices";

export const addRecommended = async (req: Request, res: Response) => {
  console.log("POST request received");
  console.log(req.body);
  console.log(req.file);

  try {
    const { name, rating, route } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const newService = new RecommendedService({
      name,
      image: req.file.filename,
      rating,
      route,
    });

    const saved = await newService.save();

    return res.status(201).json(saved);
  } catch (err) {
  console.error("ADD RECOMMENDED ERROR:");
  console.error(err);

  return res.status(500).json(err);
}
};

export const getRecommended = async (req: Request, res: Response) => {
  try {
    const services = await RecommendedService.find();

    return res.status(200).json(services);
  } catch (err) {
    const error = err as Error;

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteRecommended = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await RecommendedService.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    return res.status(200).json({
      message: "Deleted successfully",
    });
  } catch (err) {
    const error = err as Error;

    return res.status(500).json({
      message: error.message,
    });
  }
};
import Service from "../models/service"; // adjust path
import { Request, Response } from "express";
import fs from "fs";
import path from "path";

export const getServices = async (
  req: Request,
  res: Response
) => {
  try {
    const filter =
      req.query.category
        ? { category: req.query.category as string }
        : {};

    const services = await Service.find(filter);
    res.json(services);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getServiceById = async (
  req: Request,
  res: Response
) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createService = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        message: "Name, price and category are required",
      });
    }

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : undefined;

    const service = await Service.create({
      name,
      description,
      price,
      category,
      image,
    });

    res.status(201).json(service);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateService = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;

    const existing = await Service.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Service not found" });
    }

    const updateData: any = { name, description, price, category };

    // If a new image was uploaded, replace the old one
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;

      // delete old image file from disk if it exists
      if (existing.image) {
        const oldPath = path.join(__dirname, "..", existing.image);
        fs.unlink(oldPath, (err) => {
          if (err) console.warn("Could not delete old image:", err.message);
        });
      }
    }

    const updated = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteService = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // delete image file from disk if it exists
    if (service.image) {
      const imagePath = path.join(__dirname, "..", service.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.warn("Could not delete image:", err.message);
      });
    }

    await Service.findByIdAndDelete(id);

    res.json({ message: "Service deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
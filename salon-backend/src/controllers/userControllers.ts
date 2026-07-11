import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    
    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      
    });

  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Error creating user" });
  }
};

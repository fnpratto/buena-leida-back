import { Request, Response } from "express";
import User from "../models/User";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email,password,username,favouritegenders  } = req.body;

  try {
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      res.status(400).json({ error: "Email is already registered" });
      return;
    }

    const existingUserByUsername = await User.findOne({ where: { username } });
    if (existingUserByUsername) {
      res.status(400).json({ error: "Username is already taken" });
      return;
    }

    const defaultBio = "Bienvenido a mi perfil";
    const defaultProfilePhoto = "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fdefault.jpg?alt=media&token=100a1fe2-fd46-4fc5-9d11-e7b78ed946f5";
    const favouritegendersArray = Array.isArray(favouritegenders) ? favouritegenders : [favouritegenders];

    const newUser = await User.create({
      name,
      email,
      password,
      username,
      favouritegenders: favouritegendersArray,  
      bio: defaultBio,
      profilePhoto: defaultProfilePhoto
    });

    //para probar:
    res.json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
      favouritegenders: newUser.favouritegenders,
      fotoPerfil: newUser.profilePhoto,
      biografia: newUser.bio,
    });
    
  } catch (error) {
    console.error("Error during user creation:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.password !== password) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: "Error logging in user" });
  }
};

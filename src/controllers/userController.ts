import { Request, Response } from "express";
import User from "../models/User";
import { Op } from "sequelize";

export const checkUserExists = async (req: Request, res: Response) => {
  const { email, username } = req.body;

  try {
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      res.status(400).json({ error: "Email ya registrado." });
      return;
    }

    const existingUserByUsername = await User.findOne({ where: { username } });
    if (existingUserByUsername) {
      res.status(409).json({ error: "Nombre de usuario tomado." });
      return;
    }

    res.json();
  } catch (error) {
    res.status(500).json({ error: "Error validando inputs" });
    return;
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId, {
      attributes: [
        "id",
        "name",
        "username",
        "bio",
        "profilePhoto",
        "favouritegenders",
      ],
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user profile" });
  }
};

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
  const { name, email, password, username, favouritegenders } = req.body;

  console.log("Creating user with data:", req.body);

  if (!name || !email || !password || !username || !favouritegenders) {
    res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      res.status(400).json({ error: "Email is already registered" });
    }

    const existingUserByUsername = await User.findOne({ where: { username } });
    if (existingUserByUsername) {
      res.status(400).json({ error: "Username is already taken" });
    }

    const defaultBio = "Bienvenido a mi perfil";
    const defaultProfilePhoto =
      "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fdefault.jpg?alt=media&token=100a1fe2-fd46-4fc5-9d11-e7b78ed946f5";
    const favouritegendersArray = Array.isArray(favouritegenders)
      ? favouritegenders
      : [favouritegenders];

    const newUser = await User.create({
      name,
      email,
      password,
      username,
      favouritegenders: favouritegendersArray,
      bio: defaultBio,
      profilePhoto: defaultProfilePhoto,
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

export const editUser = async (req: Request, res: Response) => {
  const { name, email, favouritegenders } = req.body;

  if (!name || !email || !favouritegenders) {
    res.status(400).json({ error: "Campos vacíos" });
    return;
  }

  // validar formato email

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    await user.update({
      name: name,
      email: email,
      favouritegenders: favouritegenders,
    });

    res.json({ message: "Usuario actualizado exitosamente", user });
  } catch (error) {
    res.status(500).json({ error: "Error al editar usuario" });
  }
};

export const updateName = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.name = name;
    await user.save();

    res.json({ message: "Name updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Error updating name" });
  }
};

export const updateProfilePhoto = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { profilePhoto } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.profilePhoto = profilePhoto;
    await user.save();

    res.json({ message: "Profile photo updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Error updating profile photo" });
  }
};

export const updateBio = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { bio } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.bio = bio;
    await user.save();

    res.json({ message: "Bio updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Error updating bio" });
  }
};

export const createUsers = async (req: Request, res: Response) => {
  const usersData = req.body.users;

  if (!Array.isArray(usersData) || usersData.length === 0) {
    res.status(400).json({ error: "A non-empty array of users is required." });
    return;
  }

  const createdUsers = [];
  const errors = [];

  for (const userData of usersData) {
    const { name, email, password, username, favouritegenders } = userData;

    if (!name || !email || !password || !username || !favouritegenders) {
      errors.push({ userData, error: "All fields are required." });
      continue;
    }

    try {
      const existingUserByEmail = await User.findOne({ where: { email } });
      if (existingUserByEmail) {
        errors.push({ userData, error: "Email is already registered." });
        continue;
      }

      const existingUserByUsername = await User.findOne({
        where: { username },
      });
      if (existingUserByUsername) {
        errors.push({ userData, error: "Username is already taken." });
        continue;
      }

      const defaultBio = "Bienvenido a mi perfil";
      const defaultProfilePhoto =
        "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fdefault.jpg?alt=media&token=100a1fe2-fd46-4fc5-9d11-e7b78ed946f5";
      const favouritegendersArray = Array.isArray(favouritegenders)
        ? favouritegenders
        : [favouritegenders];

      const newUser = await User.create({
        name,
        email,
        password,
        username,
        favouritegenders: favouritegendersArray,
        bio: defaultBio,
        profilePhoto: defaultProfilePhoto,
      });

      createdUsers.push({
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
      errors.push({ userData, error: "Error creating user." });
      return;
    }
  }

  res.json({
    createdUsers,
    errors,
  });
};

export const searchUserProfile = async (req: Request, res: Response) => {
  const { identifier } = req.params;

  try {
    let user = await User.findOne({
      where: { username: identifier },
      attributes: [
        "id",
        "name",
        "username",
        "bio",
        "profilePhoto",
        "favouritegenders",
      ],
    });

    if (!user) {
      user = await User.findOne({
        where: { name: identifier },
        attributes: [
          "id",
          "name",
          "username",
          "bio",
          "profilePhoto",
          "favouritegenders",
        ],
      });
    }

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Error searching for user profile:", error);
    res.status(500).json({ error: "Error searching for user profile" });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  const { name } = req.params;
  if (!name) {
    res.status(400).json({ message: "The name is required to search" });
    return;
  }
  try {
    let users = await User.findAll({
      where: {
        [Op.or]: [
          {
            username: {
              [Op.iLike]: `%${name}%`,
            },
          },
          {
            name: {
              [Op.iLike]: `%${name}%`,
            },
          },
        ],
      },
      attributes: ["id", "name", "username", "profilePhoto", "bio"],
    });
    if (users.length === 0) {
      res.status(404).json({ error: "Users not found for this name" });
      return;
    }
    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Error searching for users" });
  }
};

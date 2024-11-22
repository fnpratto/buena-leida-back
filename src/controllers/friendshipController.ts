import { Request, Response } from "express";
import Friendship from "../models/Friendship";
import User from "../models/User";

export const areFriends = async (req: Request, res: Response) => {
    const { userId, friendId } = req.params;
  
    try {
      const friendship = await Friendship.findOne({
        where: {
          userId,
          friendId,
        },
      });
  
      if (!friendship) {
        res.status(404).json({ message: "No son amigos." });
        return;
      }
  
      res.status(200).json({ message: "Son amigos." });
    } catch (error) {
      console.error("Error checking friendship:", error);
      res.status(500).json({ message: "Error checking friendship", error });
    }
};

export const getAllFriends = async (req: Request, res: Response) => {
    const { userId } = req.params;
  
    try {
      const friendships = await Friendship.findAll({
        where: { userId },
        include: [
          {
            model: User,
            as: "friend",
            attributes: ["id", "username", "name", "profilePhoto"],
          },
        ],
        attributes: ["id", "createdAt"],
      });
  
      const friends = friendships.map((friendship) => ({
        id: friendship.friend.id,
        username: friendship.friend.username,
        name: friendship.friend.name,
        profilePhoto: friendship.friend.profilePhoto,
        friendshipDate: friendship.createdAt,
      }));
  
      res.status(200).json(friends);
    } catch (error) {
      console.error("Error fetching friends:", error);
      res.status(500).json({ message: "Error fetching friends", error });
    }
};

export const createFriendship = async (req: Request, res: Response) => {
    const { userId, friendId } = req.body;

    try {
        const user = await User.findByPk(userId);
        const friend = await User.findByPk(friendId);

        if (!user || !friend) {
        res.status(404).json({ message: "Uno o ambos usuarios no encontrados." });
        return;
        }

        const existingFriendship = await Friendship.findOne({
        where: { userId, friendId },
        });

        if (existingFriendship) {
        res.status(400).json({ message: "Usuarios ya son amigos." });
        return;
        }

        await Friendship.create({ userId, friendId });
        await Friendship.create({ userId: friendId, friendId: userId });

        res.status(201).json({ message: "Amistad creada." });
    } catch (error) {
        console.error("Error creating friendship:", error);
        res.status(500).json({ message: "Error creating friendship", error });
    }
};

export const deleteFriendship = async (req: Request, res: Response) => {
    const { userId, friendId } = req.body;
  
    try {
      const friendship1 = await Friendship.findOne({ where: { userId, friendId } });
      const friendship2 = await Friendship.findOne({ where: { userId: friendId, friendId: userId } });
  
      if (!friendship1 || !friendship2) {
        res.status(404).json({ message: "Amistad no encontrada." });
        return;
      }
  
      await friendship1.destroy();
      await friendship2.destroy();
  
      res.status(200).json({ message: "Amistad borrada." });
    } catch (error) {
      console.error("Error deleting friendship:", error);
      res.status(500).json({ message: "Error deleting friendship", error });
    }
};
  
  
  
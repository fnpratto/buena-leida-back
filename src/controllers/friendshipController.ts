import { Request, Response } from "express";
import Friendship from "../models/Friendship";
import User from "../models/User";
import FriendRequest from "../models/FriendRequest";

export const areFriends = async (req: Request, res: Response) => {
    const { userid, friendid } = req.params;
  
    try {
      const friendship = await Friendship.findOne({
        where: {
          userid: Number(userid),
          friendid: Number(friendid),
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
    const { userid } = req.params;
  
    try {
      const friendships = await Friendship.findAll({
        where: { userid: Number(userid), },
      });

      const friendshipUsersIds = friendships.map((friendships) => friendships.friendid);

      const friendsUsers = await User.findAll({
        where: { id: friendshipUsersIds },
        attributes: ["id", "username", "name", "profilePhoto"],
      });
        const friendshipsWithDetails = friendships.map((friendship) => {
            const friendUser = friendsUsers.find((user) => user.id === friendship.friendid);
            return {
              friendship: friendship.id,
              friend: friendUser ? { 
                id: friendUser.id,
                username: friendUser.username, 
                name: friendUser.name, 
                profilePhoto: friendUser.profilePhoto 
              } : null,
            };
          });
  
      res.status(200).json(friendshipsWithDetails);
    } catch (error) {
      console.error("Error fetching friends:", error);
      res.status(500).json({ message: "Error fetching friends", error });
    }
};

export const createFriendship = async (req: Request, res: Response) => {
    const { userid, friendid } = req.body;

    try {
        const user = await User.findByPk(userid);
        const friend = await User.findByPk(friendid);

        if (!user || !friend) {
        res.status(404).json({ message: "Uno o ambos usuarios no encontrados." });
        return;
        }

        const existingFriendship = await Friendship.findOne({
        where: { userid, friendid },
        });

        if (existingFriendship) {
        res.status(400).json({ message: "Usuarios ya son amigos." });
        return;
        }

        await Friendship.create({ userid, friendid });
        await Friendship.create({ userid: friendid, friendid: userid });

        res.status(201).json({ message: "Amistad creada." });
    } catch (error) {
        console.error("Error creating friendship:", error);
        res.status(500).json({ message: "Error creating friendship", error });
    }
};

export const deleteFriendship = async (req: Request, res: Response) => {
    const { userid, friendid } = req.body;
  
    try {
      const friendship1 = await Friendship.findOne({ where: { userid, friendid } });
      const friendship2 = await Friendship.findOne({ where: { userid: friendid, friendId: userid } });
  
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

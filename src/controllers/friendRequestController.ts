
import { Request, Response } from "express";
import { Op } from "sequelize";
import FriendRequest from "../models/FriendRequest"; 
import User from "../models/User"; 
import Friendship from "../models/Friendship"; 


export const getFriendRequests = async (req: Request, res: Response) => {
    const { userId } = req.params;
  
    try {
      const receivedRequests = await FriendRequest.findAll({
        where: { receiverId: userId },
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "username", "name", "profilePhoto"],
          },
        ],
        attributes: ["id", "senderId", "createdAt"], 
      });
  
      res.status(200).json(receivedRequests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      res.status(500).json({ message: "Error fetching friend requests", error });
    }
};
  
export const sendFriendRequest = async (req: Request, res: Response) => {
    const { senderId, receiverId } = req.body;
  
    if (senderId === receiverId) {
      res.status(400).json({ message: "No puedes enviarte una solicitud de amistad a vos mismo." });
      return;
    }
  
    try {
      const sender = await User.findByPk(senderId);
      const receiver = await User.findByPk(receiverId);
  
      if (!sender || !receiver) {
        res.status(404).json({ message: "Usuario no encontrado." });
        return;
      }
  
      const existingRequest = await FriendRequest.findOne({
        where: { senderId, receiverId },
      });
  
      if (existingRequest) {
        res.status(400).json({ message: "Solicitud de amistad ya enviada." });
        return;
      }
  
      const friendRequest = await FriendRequest.create({
        senderId,
        receiverId,
      });
  
      res.status(201).json(friendRequest);
    } catch (error) {
      console.error("Error sending friend request:", error);
      res.status(500).json({ message: "Error sending friend request", error });
    }
};

export const acceptFriendRequest = async (req: Request, res: Response) => {
    const { requestId } = req.params;
  
    try {
      const friendRequest = await FriendRequest.findByPk(requestId);
  
      if (!friendRequest) {
        res.status(404).json({ message: "Solicitud de amistad no encontrada."});
        return;
      }
  
      await Friendship.create({
        userId: friendRequest.senderId,
        friendId: friendRequest.receiverId,
      });
  
      await Friendship.create({
        userId: friendRequest.receiverId,
        friendId: friendRequest.senderId,
      });
  
      await friendRequest.destroy();
  
      res.status(200).json({ message: "Solicitud aceptada." });
    } catch (error) {
      console.error("Error accepting friend request:", error);
      res.status(500).json({ message: "Error accepting friend request", error });
    }
};
  

export const rejectFriendRequest = async (req: Request, res: Response) => {
    const { requestId } = req.params;
  
    try {
      const friendRequest = await FriendRequest.findByPk(requestId);
  
      if (!friendRequest) {
        res.status(404).json({ message: "Solicitud de amistad no encontrada." });
        return;
      }

      await friendRequest.destroy();
  
      res.status(200).json({ message: "Solicitud rechazada." });
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      res.status(500).json({ message: "Error rejecting friend request", error });
    }
};
  
  
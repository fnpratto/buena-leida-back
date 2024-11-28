
import { Request, Response } from "express";
import { Op } from "sequelize";
import FriendRequest from "../models/FriendRequest"; 
import User from "../models/User"; 
import Friendship from "../models/Friendship"; 


export const getFriendRequests = async (req: Request, res: Response) => {
    const { receiverid } = req.params;
  
    try {
      const receivedRequests = await FriendRequest.findAll({
        where: { receiverid: Number(receiverid) },
      });

      const requestsUsersIds = receivedRequests.map((request) => request.senderid);

      const requestUsers = await User.findAll({
        where: { id: requestsUsersIds },
        attributes: ["id", "username", "name", "profilePhoto"],
      });
      const requestsWithDetails = receivedRequests.map((request) => {
          const sender = requestUsers.find((requestUser) => requestUser.id === request.senderid);
          return {
            requestid: request.id,
            createdAt: request.createdAt,
            sender: sender ? { 
              id: sender.id,
              username: sender.username, 
              name: sender.name, 
              profilePhoto: sender.profilePhoto 
            } : null,
          };
        });

  
      res.status(200).json(requestsWithDetails);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      res.status(500).json({ message: "Error fetching friend requests", error });
    }
};
  
export const sendFriendRequest = async (req: Request, res: Response) => {
    const { senderid, receiverid } = req.body;
  
    if (Number(senderid) === Number(receiverid)) {
      res.status(400).json({ message: "No puedes enviarte una solicitud de amistad a vos mismo." });
      return;
    }
  
    try {
      const sender = await User.findByPk(senderid);
      const receiver = await User.findByPk(receiverid);
  
      if (!sender || !receiver) {
        res.status(404).json({ message: "Usuario no encontrado." });
        return;
      }
  
      const existingRequest = await FriendRequest.findOne({
        where: { senderid, receiverid },
      });
  
      if (existingRequest) {
        res.status(400).json({ message: "Solicitud de amistad ya enviada." });
        return;
      }
  
      const friendRequest = await FriendRequest.create({
        senderid,
        receiverid,
      });
  
      res.status(201).json(friendRequest);
    } catch (error) {
      console.error("Error sending friend request:", error);
      res.status(500).json({ message: "Error sending friend request", error });
    }
};

export const acceptFriendRequest = async (req: Request, res: Response) => {
    const { friendRequestId } = req.params;
  
    try {
      const friendRequest = await FriendRequest.findByPk(Number(friendRequestId));
  
      if (!friendRequest) {
        res.status(404).json({ message: "Solicitud de amistad no encontrada."});
        return;
      }
  
      await Friendship.create({
        userid: friendRequest.senderid,
        friendid: friendRequest.receiverid,
      });
  
      await Friendship.create({
        userid: friendRequest.receiverid,
        friendid: friendRequest.senderid,
      });
  
      await friendRequest.destroy();
  
      res.status(200).json({ message: "Solicitud aceptada." });
    } catch (error) {
      console.error("Error accepting friend request:", error);
      res.status(500).json({ message: "Error accepting friend request", error });
    }
};
  

export const rejectFriendRequest = async (req: Request, res: Response) => {
    const { friendRequestId } = req.params;
  
    try {
      const friendRequest = await FriendRequest.findByPk(Number(friendRequestId));
  
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
  
  
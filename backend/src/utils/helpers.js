import Friendship from "../models/friendship.model.js";

export const getFriendsIds = async (userId) => {
  try {
    const friendships = await Friendship.find({
      $or: [
        { requester: userId, status: "accepted" },
        { recipient: userId, status: "accepted" },
      ],
    });

    const friendIds = friendships.map((friendship) =>
      friendship.requester.toString() === userId
        ? friendship.recipient.toString()
        : friendship.requester.toString()
    );

    return friendIds;
  } catch (error) {
    console.error("Error getting friends:", error);
    return [];
  }
};

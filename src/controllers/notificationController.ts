import { Request, Response } from 'express';
import Notification from '../models/Notification';

export const getUserNotifications = async (req: any, res: Response) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
};

export const markAsRead = async (req: any, res: Response) => {
  const notification = await Notification.findById(req.params.id);

  if (notification && notification.user.toString() === req.user._id.toString()) {
    notification.isRead = true;
    await notification.save();
    res.json({ message: 'Notification marked as read' });
  } else {
    res.status(404).json({ message: 'Notification not found or unauthorized' });
  }
};

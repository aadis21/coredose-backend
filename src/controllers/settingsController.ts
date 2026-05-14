import { Request, Response } from 'express';
import Settings from '../models/Settings';

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public (Only public fields)
export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await Settings.findOne({});
    if (settings) {
      // Exclude sensitive fields for public
      const publicSettings = {
        storeName: settings.storeName,
        contactEmail: settings.contactEmail,
        currency: settings.currency,
        heroHeadline: settings.heroHeadline,
        heroSubHeadline: settings.heroSubHeadline,
        heroImage: settings.heroImage,
      };
      res.json(publicSettings);
    } else {
      res.status(404).json({ message: 'Settings not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all settings (Admin)
// @route   GET /api/settings/admin
// @access  Private/Admin
export const getAdminSettings = async (req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Superadmin
export const updateSettings = async (req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne({});

    if (settings) {
      settings.storeName = req.body.storeName || settings.storeName;
      settings.contactEmail = req.body.contactEmail || settings.contactEmail;
      settings.currency = req.body.currency || settings.currency;
      settings.heroHeadline = req.body.heroHeadline || settings.heroHeadline;
      settings.heroSubHeadline = req.body.heroSubHeadline || settings.heroSubHeadline;
      settings.heroImage = req.body.heroImage || settings.heroImage;
      settings.razorpayKeyId = req.body.razorpayKeyId || settings.razorpayKeyId;
      settings.cloudinaryApiSecret = req.body.cloudinaryApiSecret || settings.cloudinaryApiSecret;

      const updatedSettings = await settings.save();
      res.json(updatedSettings);
    } else {
      settings = await Settings.create(req.body);
      res.status(201).json(settings);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

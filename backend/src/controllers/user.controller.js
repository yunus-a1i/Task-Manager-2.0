import User from '../models/User.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        notificationPreference: user.notificationPreference,
        themePreference: user.themePreference,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, avatar, notificationPreference, themePreference } = req.body;

    const user = await User.findById(req.user._id);

    if (name !== undefined) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (notificationPreference !== undefined) user.notificationPreference = notificationPreference;
    if (themePreference !== undefined) user.themePreference = themePreference;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        notificationPreference: user.notificationPreference,
        themePreference: user.themePreference
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
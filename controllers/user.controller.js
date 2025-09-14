// @desc    Get the profile of the currently logged-in user
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  // Because our 'protect' middleware ran first,
  // we have the user object attached to the request.
  const user = req.user;

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pgOwner: user.pgOwner,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

module.exports = {
  getUserProfile,
};

const User = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.registerUser = async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(400).json({ message: "User with that email already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
        req.body.role = 'user';

        const newUser = new User(req.body);
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.secret_key_jwt, {
            expiresIn: '1h',
        });

        if (req.body.role === 'partner') {
            const partnerRequest = new PartnerRequest({ userId: newUser._id });
            await partnerRequest.save();
        }
        res.send({
            success: true,
            message: 'User created',
            userId: newUser._id,
            token
        });
    } catch (error) {
        res.status(500).json({ message: "Not able to create user " + error });
    }
}



exports.loginUser = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
  
      if (!user) {
        res.send({
          success: false,
          message: "user does not exist Please Register",
        });
      }
  
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
  
      if (!validPassword) {
        res.send({
          success: false,
          message: "Sorry, invalid password entered!",
        });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.secret_key_jwt, {
        expiresIn: "7d",
      });
  
      res.send({
        success: true,
        message: "You've successfully logged in!",
        token: token,
      });
    } catch (error) {
      console.error(error);
    }
  };

exports.getAllUsers = async (req, res) => {
    const users = await User.find();
    return res.status(200).json(users);
};

exports.getUserById = async (req, res) => {
    try{
      const user = await User.findById(req.params.id);
      res.json(user);
    } catch(error){
      res.json({message: "User not found"});
    }
}

exports.updateUser = async (req, res) => {
    try{
      const updatedUser = await User.updateOne({_id: req.params.id}, {$set: req.body});
      res.json(updatedUser);
    } catch(error){
      res.json({message: "User not found"});
    }
}
// current user using token
exports.getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // Exclude password field
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getPartnerRequests = async (req, res) => {
  try {
    const partnerRequests = await User.find({ partnerRequest: true });
    res.status(200).json({ partnerRequests });
  } catch (error) {
    console.error('Error fetching partner requests:', error);
    res.status(500).json({ message: 'Failed to fetch partner requests.' });
  }
};

exports.sendPartnerRequest = async (req, res) => {
  const { userId } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { partnerRequest: true } },
      { new: true }
    );
  } catch (error) {
    console.error('Error sending partner request:', error);
    res.status(500).json({ message: 'Failed to send partner request.' });
  }
}

exports.approvePartnerRequest = async (req, res) => {

  const { userId } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { role: 'partner', partnerRequest: false } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'Partner request approved.', user: updatedUser });
  } catch (error) {
    console.error('Error approving partner request:', error);
    res.status(500).json({ message: 'Failed to approve partner request.' });
  }
};

exports.rejectPartnerRequest = async (req, res) => {

  const { userId } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { partnerRequest: false } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'Partner request rejected.', user: updatedUser });
  } catch (error) {
    console.error('Error rejecting partner request:', error);
    res.status(500).json({ message: 'Failed to reject partner request.' });
  }
}

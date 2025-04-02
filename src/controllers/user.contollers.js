import { User } from "../models/user.models.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const JWT_SECRET = "anshu";
export const registerController = async(req, res) => {
    const {username, password} = req.body;
    if(!username || !password){
        return res.status(400).json("Username or password empty");
    }

    if(password.length < 6){
        return res.status(400).json({message: "Password must be atleast 6 characters long."});
    }
    try{
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
          return res.status(409).json({ message: "Username is already taken" });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            username,
            password: hashedPassword,
        })
        const token = jwt.sign(
            { userId: newUser._id},
            JWT_SECRET,
            { expiresIn: "24h" } // Token will expire in 1 hour
          );
        await newUser.save();
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
            },
            token,
        });
    }
    catch(error){
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


User.schema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};


export const loginController = async(req,res) => {
    try {
      const { username, password } = req.body;
      
      const user = await User.findOne({ username: username });
      if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }
     
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign(
        { userId: user._id, email: user.email},
        JWT_SECRET,
        { expiresIn: "24h" } // Token will expire in 24 hour
      );
      res.status(200).json({
          message: 'Login successful',
          user: { id: user._id, username: user.username },
          token
      });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
  }
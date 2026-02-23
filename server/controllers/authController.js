const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//  registring user

const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        //  user exist or not
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "user already exist" });
        }
    
        //  hashing pass
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //  create user

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        // gen JWT token

        const token = await jwt.sign({ 
            id: user._id,
            role: user.role
        },
            process.env.JWT_SECRET, { expiresIn: "2h" }
        )

        //  response send
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (err) {
        res.status(500).json({
            message:err.message
        })
    }

};


//  log in

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        //  if user exist
        const user = await User.findOne({ email })
        if (!user) {
         return   res.status(400).json({ message: "Invalid email or password" })
        }
        //  check for pass
        const passMatch = await bcrypt.compare(password, user.password);
        if (!passMatch) {
           return res.status(400).json({ message: "Invalid email or password" })
        }

        //  generate jwt 
        const token = await jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        )


        //  send respone

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        })
    } catch (err) {
        res.status(500).json({message:err.message})
    }
}


module.exports = { registerUser,loginUser }



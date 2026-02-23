const jwt = require("jsonwebtoken")

const authMiddleware = async (req, res, next) => {
    try {
        
        //  get token from req header
        const header = req.headers.authorization
        if (!header || !header.startsWith("Bearer ")) {
            return res.json({message:"No token , auth denied"})
        }
        //  extracting token 
        token = header.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //  attaching to req
        req.user = decoded
        next()
    }
    catch (err) {
        res.status(401).json({message:"Token not valid"})
    }
}

module.exports=authMiddleware
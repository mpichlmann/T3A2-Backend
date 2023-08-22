import { UserModel } from '../db.js'
import jwt from 'jsonwebtoken'

// Middleware function to check if user is an admin
const checkAdminMiddleware = (req, res, next) => {
    const token = req.header('Authorization')
  
    if (!token) {
      return res.status(401).json({ message: 'Authorization token not provided.' })
    }
  
    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); 
      const isAdmin = decodedToken.isAdmin;
  
      if (isAdmin) {
        next();
      } else {
        return res.status(403).json({ message: 'Access denied. User is not an admin.' })
      }
    } catch (error) {
      return res.status(500).json({ message: 'Failed to verify authorization token.' })
    }
  };
  
export { checkAdminMiddleware } 
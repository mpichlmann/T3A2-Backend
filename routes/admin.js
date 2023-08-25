import jwt from 'jsonwebtoken'

// Middleware function to check if user is an admin
const checkAdminMiddleware = (req, res, next) => {
    const token = req.header('Authorization')

    if (!token) {
      return res.status(401).send({ message: 'Authorization token not provided.' })
    }
  
    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) 
      const isAdmin = decodedToken.isAdmin
  
      if (isAdmin) {
        next()
      } else {
        return res.status(403).send({ message: 'Access denied. User is not an admin.' })
      }
    } catch (err) {
      return res.status(500).send( {error: err.message })
    }
  }
  
// Middleware to get the user from the jwt
const getUserId = (req, res, next) => {
  const token = req.header('Authorization')

  if (!token) {
    return res.status(401).send({ message: 'Authorization token not provided.' })
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) 
    req.user = decodedToken.userId  
    next()
  } catch (err) {
    return res.status(500).send({ error: err.message })
  }
}

export { checkAdminMiddleware, getUserId }
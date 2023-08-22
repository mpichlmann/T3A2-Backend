

app.post('/login', (req, res) => {
    // Authenticate User
    const username = req.body.username
    const user = { name: username }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken})
})



// Middleware function to check if user is an admin
const checkAdminMiddleware = (req, res, next) => {
    const token = req.header('Authorization'); // Assuming the token is sent in the Authorization header
  
    if (!token) {
      return res.status(401).json({ message: 'Authorization token not provided.' });
    }
  
    try {
      const decodedToken = jwt.verify(token, 'your-secret-key'); // Replace with your secret key
      const isAdmin = decodedToken.isAdmin;
  
      if (isAdmin) {
        // User is an admin, allow access to the route
        next();
      } else {
        return res.status(403).json({ message: 'Access denied. User is not an admin.' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Failed to verify authorization token.' });
    }
  };
  
export { checkAdminMiddleware }
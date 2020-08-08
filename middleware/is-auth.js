const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  //console.log(authHeader);
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(' ')[1]; //Bearer tokenstring
  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    // {
    //   userId: '5f2137b93da9277ac87a860e',
    //   email: 'user.pass@gmail.com',
    //   iat: 1596237126,
    //   exp: 1596240726
    // }
    decodedToken = jwt.verify(token, 'somesupersecretkey');
    //console.log(decodedToken);
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};

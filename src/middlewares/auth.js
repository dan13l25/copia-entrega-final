export function auth(req, res, next) {
  if (process.env.NODE_ENV === 'development' && req.path.startsWith('/apidocs')) {
    return next();
  }

  if (!req.session || !req.session.user) {
    return res.redirect("/login");
  }
  next();
}

export function setTestUser(req, res, next) {
  if (process.env.NODE_ENV === 'test') {
    req.session = { user: { id: 1, email: 'user@example.com', role: 'admin' } };
  }
  next();
}

export function generateRandomCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

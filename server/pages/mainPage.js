function song(req, res) {
  const { passport = {} } = req.session;
  const user = passport.user ? { n: passport.user.displayName } : {};
  const encode = Buffer.from(JSON.stringify(user)).toString('base64');
  const loggedIn = `var __u='${encode}'`;
  res.render('mainPage', { title: 'mubox', loggedIn });
}

export default song;

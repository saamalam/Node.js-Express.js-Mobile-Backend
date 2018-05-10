const User = require('../models/Post');
/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', { user:req.user });
};
exports.postsbymonth = (req, res) => {

}
exports.mostlikes = (req, res) => {

}
exports.topinterests = (req, res) => {

}
exports.topviewed = (req, res) => {

}

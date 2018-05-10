const Post = require('../models/Post');
const Category = require('../models/Category');

exports.getPost = (req, res, next) => {
Post
.findById(req.params.id)
.populate('author', 'name')
.populate('category')
.exec(function(err, post){
    
    res.render('post', {post: post})
})
}

exports.getPosts = (req, res, next) => {

    var perPage = 20
    var page = req.params.page || 1
    var query = req.params.query || ''
    Post
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .populate('author', 'name')
    .populate('category')
    .sort('_id')
    .exec(function(err, posts) {        
        Post.find({}).count().exec(function(err, count) {            
            if (err) return next(err)
            res.render('posts', {
                posts: posts,
                current: page,
                pages: Math.ceil(count / perPage),
                search: query,
                count: count,
                range1: ((page-1)*perPage)+1,
                range2: (page*perPage)>count?count:page*perPage
            })
        })
    })

}
exports.getPostsByPage = (req, res, next) => {
    var perPage = 20
    var page = req.params.page || 1
    var query = req.params.query || ''
    Post
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .populate('author', 'name')
    .populate('category')
    .sort('_id')
    .exec(function(err, posts) {
        Post.find({}).count().exec(function(err, count) {
            if (err) return next(err)
            res.render('posts', {
                posts: posts,
                current: page,
                pages: Math.ceil(count / perPage),
                search: query,
                count: count,
                range1: ((page-1)*perPage)+1,
                range2: (page*perPage)>count?count:page*perPage
            })
        })
    })
}

exports.getPostsSearch = (req, res, next) => {

    var perPage = 20
    var page = req.params.page || 1
    var query = req.params.query || ''
    Post
    .find({$or: [{title:new RegExp(query, 'i')}, {description: new RegExp(query, 'i')}]})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .populate('author', 'name')
    .populate('category')
    .sort('_id')
    .exec(function(err, posts) {   
        if(err) console.log(err)    
        Post.find({$or: [{title:new RegExp(query, 'i')}, {description: new RegExp(query, 'i')}]}).count().exec(function(err, count) {
            
            if (err) return next(err)
            res.render('posts', {
                posts: posts,
                current: page,
                pages: Math.ceil(count / perPage),
                search: query,
                count: count,
                range1: ((page-1)*perPage)+1,
                range2: (page*perPage)>count?count:page*perPage
            })
        })
    })

}


exports.addPost = (req, res) => {
    

}

exports.deletePost = (req, res, next) => {
   // console.log('delete command pressed')
    console.log("Id: " + req.params.id)
    Post.remove({ _id: req.params.id }, (err) => {
        if (err) { return next(err); }        
        return { msg: 'Item has been deleted successfully.' }   
      });
    

}

exports.updatePost = (req, res) => {
    

}

exports.getCategories= (req, res, next) => {

    var perPage = 20
    var page = req.params.page || 1
    var query = req.params.query || ''
    Category
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)    
    .sort('_id')
    .exec(function(err, categories) {        
        Category.find({}).count().exec(function(err, count) {            
            if (err) return next(err)
            res.render('categories', {
                categories: categories,
                current: page,
                pages: Math.ceil(count / perPage),
                count: count,
                range1: ((page-1)*perPage)+1,
                range2: (page*perPage)>count?count:page*perPage
            })
        })
    })
}

exports.deleteCategory = (req, res, next) => {    
     Category.remove({ _id: req.params.id }, (err) => {
         if (err) { return next(err); }        
         return { msg: 'Category has been deleted successfully.' }   
       });
     
 
 }
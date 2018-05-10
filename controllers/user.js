const User = require('../models/User');

exports.getUsers = (req, res) => {

    var perPage = 20
    var page = req.params.page || 1
    var query = req.params.query || ''
    User
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)    
    .populate('interests')
    .sort('_id')
    .exec(function(err, users) {        
        User.find({}).count().exec(function(err, count) {            
            if (err) return next(err)
            res.render('users', {
                users: users,
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

exports.getUsersSearch = (req, res, next) => {

    var perPage = 20
    var page = req.params.page || 1
    var query = req.params.query || ''
    User
    .find({$or: [{name:new RegExp(query, 'i')}, {email: new RegExp(query, 'i')}, {phoneNo: new RegExp(query, 'i')}]})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .populate('interests')
    .sort('_id')
    .exec(function(err, users) {   
        if(err) console.log(err)    
        User.find({$or: [{name:new RegExp(query, 'i')}, {email: new RegExp(query, 'i')}, {phoneNo: new RegExp(query, 'i')}]}).count().exec(function(err, count) {
            
            if (err) return next(err)
            res.render('users', {
                users: users,
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

exports.getUsersByPage = (req, res, next) => {
    var perPage = 20
    var page = req.params.page || 1
    var query = req.params.query || ''
    User
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .populate('interests')
    .sort('_id')
    .exec(function(err, users) {
        User.find({}).count().exec(function(err, count) {
            if (err) return next(err)
            res.render('users', {
                users: users,
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

exports.addUser = (req, res) => {
    

}

exports.deleteUser = (req, res) => {
       
       User.remove({ _id: req.params.id }, (err) => {
           if (err) { return next(err); }        
           return { msg: 'User has been deleted successfully.' }   
         });
    

}

exports.updateUser = (req, res) => {
    

}
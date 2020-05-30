var express = require('express');
const moment = require('moment');

var phoneDetailModel=require('../modules/employee');
var router = express.Router();
var phonedetail=phoneDetailModel.find({}); 


/* GET home page. */

router.get('/', function(req, res, next) {


  var perPage=3;
  var page=1;
phonedetail.skip((perPage * page) - perPage)
 .limit(perPage).exec(function(err,data){
  if(err) throw err;

  data = JSON.parse(JSON.stringify(data));
  data = data.map(d=>{
    d.date_format = moment(new Date(d.dob)).format('DD MMM, YYYY');
    return d;
  });

   phoneDetailModel.countDocuments({}).exec((err,count)=>{
     res.render('index', { title: 'RM-PHONEBOOK',
      records:data,
     current:page,
   pages:Math.ceil(count/perPage)
   });
   });
  
 });

});

router.get('/:page', function(req, res, next) {


 var perPage=3;
 var page=req.params.page||1;
phonedetail.skip((perPage * page) - perPage)
.limit(perPage).exec(function(err,data){
 if(err) throw err;
 data = JSON.parse(JSON.stringify(data));
 data = data.map(d=>{
   d.date_format = moment(new Date(d.dob)).format('DD MMM, YYYY');
   return d;
 });
  phoneDetailModel.countDocuments({}).exec((err,count)=>{
    res.render('index', { title: 'RM-PHONEBOOK',
     records:data,
    current:page,
  pages:Math.ceil(count/perPage)
  });
  });
 
});

});

 

router.post('/', function(req, res, next) {
  
  var perPage=3;
  var page=1;

var details=new phoneDetailModel({
  name:req.body.uname,
  email:req.body.email,
  number:req.body.number,
  dob:req.body.dob 
});

details.save(function(err,res1){
  if(err) throw err;
  phonedetail.exec(function(err,data){
    if(err) throw err;

    res.redirect('/');
    // phoneDetailModel.countDocuments({}).exec((err,count)=>{
    //   res.render('index', { title: 'RM-PHONEBOOK',
    //    records:data,
    //   current:page,
    // pages:Math.ceil(count/perPage)
    // });
    // });
    //res.render('index', { title: 'RM-PHONEBOOK', records:data, pages: 2, current:1,});
  });
});
//console.log(details);

  
 
});


//create

router.get('/create/add', function(req, res, next) {
phonedetail.exec(function(err,data){
    if(err) throw err;

    data = JSON.parse(JSON.stringify(data));
    data = data.map(d=>{
      d.date_format = moment(new Date(d.dob)).format('DD MMM, YYYY');
      return d;
    });

    res.render('create', { title: 'RM-PHONEBOOK', });
  })
 
});
 

router.post('/create/add', function(req, res, next) {

  console.log('Req', req.body);

var details=new phoneDetailModel({
  name:req.body.uname,
  email:req.body.email,
  number:req.body.number,
  dob:req.body.dob,
  other_email: req.body.other_email,
  other_phone: req.body.other_phone 
});

details.save(function(err,res1){
  if(err) res.end();
  res.redirect('/');
  // phonedetail.exec(function(err,data){
  //   if(err) throw err;

  //   res.render('create', { title: 'RM-PHONEBOOK', records:data ,});
  // });
});
//console.log(details);

  
 
});
 

///search

router.post('/search/', function(req, res, next) {
  var filterName=req.body.filtername;

 if(filterName !=''){
    var filterParameter={$and:[{name:filterName}]}
 }else{
   var filterParameter={}
 }
 var phonedetailFilter=phoneDetailModel.find(filterParameter); 

phonedetailFilter.exec(function(err,data){
      if(err) throw err;
      res.render('index', { title: 'RM-PHONEBOOK', records:data , pages: data.length, current:1});
    
  });
  //console.log(details);
  
    
   
  });


  //delete

  router.get('/delete/:id', function(req, res, next) {
    var id=req.params.id;
    var del=phoneDetailModel.deleteOne({_id: id});
       del.exec(function(err){
      if(err) throw err;
     res.redirect('/');
    //  phonedetail.exec(function(err,data){
    //   if(err) throw err;
    //   res.render('index', { title: 'RM-PHONEBOOK', records:data ,});
    // });
    });
    });


  //edit

  router.get('/edit/:id', function(req, res, next) {
    var id=req.params.id;
    var edit=phoneDetailModel.findById(id);  
    edit.exec(function(err,data){
      if(err) throw err;
      
      res.render('edit', { title: 'RM-PHONEBOOK', records:data });
    })
   
  });
   


  //update
  router.post('/update/', function(req, res, next) {
    var perPage=3;
    var page=1;
    var update=phoneDetailModel.findByIdAndUpdate(req.body.id,{
      name:req.body.uname,
      email:req.body.email,
      number:req.body.number,
      dob:req.body.dob 
    });  
    update.exec(function(err,data){
      
        if(err) throw err;
        res.redirect('/');
        // phoneDetailModel.countDocuments({}).exec((err,count)=>{
        //   res.render('index', { title: 'RM-PHONEBOOK',
        //    records:data,
        //   current:page,
        // pages:Math.ceil(count/perPage)
        // });
        // });
      //  res.render('index', { title: 'RM-PHONEBOOK', records:data ,});
      })
    });
   
  
    

module.exports = router;

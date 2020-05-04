const mysql = require('mysql');
const Express = require("express");
const BodyParser = require("body-parser");
const multer = require("multer");

var app = Express();
var cors = require('cors');

const fs = require("fs");

app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

var storage = multer.diskStorage({  
    destination:function(req,file,cb){  
         cb(null,'../front/src/assets/uploads')  
    },
    filename(req,file,cb){  
        cb(null,file.originalname)  
    }  
  });

var upload = multer({storage:storage});


const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'photography'
});

connection.connect((error)=>{
    if(error){
        throw error;
    }
    console.log('Connected to Database')
});

app.get("/uploaded-pics-name",(req,res)=>{
  connection.query("SELECT filename FROM images", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/uploaded-profilepic-name",(req,res)=>{
  connection.query("SELECT filename FROM p_pic_table", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/signup-creator",(req,res)=>{
  fullname = req.body.fullname;
  password = req.body.password;
  username = req.body.username;
  phone = req.body.phone;
  role = req.body.role;

  var sql_query = "INSERT INTO creator_table (full_name, password, username, ph_number, role) VALUES ('"+fullname+"','"+password+"','"+username+"',"+phone+",'"+role+"')";
  connection.query(sql_query,function(err,result,fields){
    if(err) throw err;
    res.send(true);
  });
});

app.post("/signin-creator",(req,res)=>{
  username = req.body.username;
  password = req.body.password;

  var sql_query = "SELECT * from creator_table WHERE username = '"+username+"' AND password = '"+password+"'";

  connection.query(sql_query,function(err,result,fields){
    if(err) throw err;
    res.send(result);
  })
})

app.post("/creator/photo/upload",upload.single('file'),(req,res)=>{
  const file = req.file;
  
  if(!file){
    res.send('File not recieved');
  }

  filename = req.file.originalname;
  pic_path = req.file.path;
  c_id = req.body.c_id;

  var sql_query = "INSERT INTO images (c_id, pic_location, filename) VALUES ("+c_id+", '"+pic_path+"', '"+filename+"')"

  connection.query(sql_query,function(err,result,fields){
    if(err) throw err;
  });
  res.send(true);
});

app.listen(process.env.PORT || 3000, (error) => {
      if(error) {
          throw error;
      }
  console.log('Server Started!!!')
});
var express = require('express');
var router = express.Router();
var fs = require('fs');
const mongoose = require('mongoose');


// connect mongoose
var db = "mongodb+srv://ducnvph16735:HavFB5YwOfBTROR5@cluster0.dykhy.mongodb.net/lab5sever?retryWrites=true&w=majority";
mongoose.connect(db).catch(error => {
    console.log("Co loi xay ra " + error);
});

/* GET home page. */
router.get('/', function (req, res, next) {

// Lay du lieu
    myDb.collection("images").find().toArray((err, objs) => {
        if (err) throw err;
        console.log("Lay du lieu thanh cong");
        res.render("index", {ds: objs});
    });
});

var myDb;

// Ket noi du lieu
var MongoClient = require("mongodb").MongoClient;
var mongo = new MongoClient(db);
mongo.connect((err, db) => {
    if (err) throw err;
    console.log("Ket noi thanh cong");
    myDb = db.db("lab5sever");
});

// Phần thêm dữ liệu vào mongoose

// Bước 1: khởi tạo Schema - model
var schemaImage = new mongoose.Schema({
    tenAnh: String,
    noidung: String,
    linkAnh: String
});

// Bước 2: khai báo Schema vói thư viện mongoose để tạo layout
var Anh = mongoose.model('images', schemaImage);


// Bước 3: Thêm ảnh
router.post("/themAnh", async function (req, res,next) {

    var tenAnh = req.body.tenAnh;
    var noidung = req.body.noidung;
    var linkAnh = req.body.linkAnh;

    const img = new Anh({
        tenAnh: tenAnh,
        noidung: noidung,
        linkAnh: linkAnh
    });

    await img.save();
    return res.redirect("/");
});

router.get('/them', function (req, res, next) {
    res.render('them_Image', {title: 'Them'});
});


// Phan sua Image
router.get('/:id/sua', function (req, res, next) {

   Anh.findById(req.params.id)
        .then(data => {
            var id = data._id;
            var ten = data.tenAnh;
            var nd = data.noidung;
            var urlAnh = data.linkAnh;
            res.render('sua_Image', {title: 'Sua',id:id, ten:ten, nd:nd, urlAnh:urlAnh});
        });
});

router.post('/sua/:id', function (req, res, next){
    Anh.findByIdAndUpdate(req.params.id, {
        tenAnh: req.body.ten,
        noidung: req.body.nd,
        linkAnh: req.body.urlAnh
    }).then((data1) =>{
        res.redirect("/");
    });
});


// Phan xoa Image
router.post('/:id', function (req, res, next){
    Anh.findByIdAndRemove(req.params.id).exec()
        .then(()=>{
        res.redirect('/');
    });
});


// Phan get API
router.get("/api", function (req, res, next){
Anh.find({}, function (err, data){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:19006');
    res.send(data);
   });
});


module.exports = router;

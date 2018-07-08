
const express   = require("express"),
    app         = express(),
    db          = require("./db"),
    multer      = require('multer'),
    uidSafe     = require('uid-safe'),
    path        = require('path'),
    config      = require('./config');


const s3 = require('./s3');
const bodyParser = require("body-parser");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(require("body-parser").urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(express.static("./public"));
app.use(express.static("./uploads"));

app.post('/upload',uploader.single('file'), s3.upload, (req, res) => {
    db.saveImage(
        req.body.title,
        req.body.description,
        req.body.username,
        config.s3Url + req.file.filename
    ).then(function(result) {
        res.json({
            image: result.rows[0]});
    }).catch(function(err) {
        console.log(err);
    });
});
app.get("/images", (req, res) => {
    db.getImages().then(function(result){
        res.json({
            success: true,
            images: result.rows
        });
    });
});
app.get("/moreimages/:moreimagesss", (req, res) => {

    db.moreImagesss(req.params.moreimagesss).then(results => {
        res.json({
            images: results.rows
        });
    });
});
app.get("/images/:id",function (req, res){
    db.getImageById(req.params.id).then(function(results){
        res.json({
            success : true,
            targetPic: results.rows[0]
        });
    }).catch(function(err){
        console.log(err);
    });
});
app.get("/comments/:id", (req, res) => {
    db.getComments(req.params.id).then(function(result) {
        res.json({
            comments: result.rows
        });
    });
});

app.post("/newcomment/:id", (req, res) => {
    db
        .saveComment(req.body.comment, req.body.username, req.params.id)
        .then(function(result) {
            res.json({
                comment: result.rows[0]
            });
        })
        .catch(function(err) {
            console.log("i wanna be a new comment", err);
        });
});
app.get('/comments/:id', (req, res) => {
    db.getComment(req.params.id).then(result => {
        res.json(result.rows);
    }).catch(function(err) {
        console.log(err);
    });
});

app.listen(8080, () => console.log("hi, imageboard server listening on port 8080"));

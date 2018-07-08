const spicedPg  = require("spiced-pg"),
    db          = spicedPg("postgres:postgres:postgres@localhost:5432/images");

module.exports.getImages = function getImages() {
    return db.query(`SELECT * FROM images ORDER BY id DESC LIMIT 9`);
};
exports.moreImagesss = function(id) {
    return db.query(
        `
        SELECT * FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 6`,
        [id]
    );
};
module.exports.uploadImage = function uploadImage(url, username, title, desc) {
    return db.query(
        `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4) RETURNING id, url, username, title, description`,
        [url, username, title, desc]
    );
};

module.exports.saveImage = function saveImage(title, description, username, url) {
    return db.query(
        `INSERT INTO images (title, description, username, url)
        VALUES ($1, $2, $3, $4) RETURNING id, url, username, title, description`,
        [title || null, description || null, username || null, url]
    );
};
module.exports.getImageById = function getImageById(id){
    return db.query("SELECT * FROM images WHERE id = $1", [id]);
};
module.exports.getComments = function(id) {
    return db.query(
        `SELECT * FROM comments
        WHERE image_id = $1 ORDER BY id DESC`,
        [id]
    );
};

module.exports.saveComment = function(comment, username, imageId) {
    return db.query(
        `INSERT INTO comments (comment, username, image_id) VALUES (
            $1,$2,$3) returning *
        `,
        [comment, username, imageId]
    );
};


Vue.component("image-modal", {
    props: ["id"],
    template: "#image-modal-template",
    data() {
        return {
            targetPic: {
                title: "",
                description: "",
                username: "",
                created_at: "",
                url: ""
            },
            newComment: {
                comment: "",
                username: ""
            },
            comments: []
        };
    },
    mounted: function() {
        var me = this;
        axios
            .get("/images/" + this.id)
            .then(function(result) {
                me.targetPic = result.data.targetPic;
            })
            .catch(function(err) {
                console.log(err);
            });
        axios
            .get("/comments/" + this.id)
            .then(function(result) {
                me.comments = result.data.comments;
            })
            .catch(function(err) {
                console.log(err);
            });
    },
    methods: {
        submitComment: function() {
            var me = this;
            axios
                .post("/newcomment/" + this.id, this.newComment)
                .then(function(result) {
                    me.comments.unshift(result.data.comment);
                });
        }
    }
});
new Vue({
    el: "#main",
    data: {
        imgFormInfo: {
            title: "",
            description: "",
            username: "",
            img: null
        },
        images: [],
        imageId: null,
        uploadVis: false
    },
    mounted: function() {
        var me = this;
        axios.get("/images").then(function(resp) {
            me.images = resp.data.images;
        });
    },
    methods: {
        theFunction: function(e) {
            console.log(e);
        },
        selectFile: function(e) {
            this.imgFormInfo.img = e.target.files[0];
        },
        uploadImage: function(e) {
            e.preventDefault();
            const fd = new FormData();

            fd.append("title", this.imgFormInfo.title);
            fd.append("description", this.imgFormInfo.description);
            fd.append("username", this.imgFormInfo.username);
            fd.append("file", this.imgFormInfo.img);
            axios
                .post("/upload", fd)
                .then(result => {
                    this.images.unshift(result.data.image);
                })
                .then(function(result) {
                    console.log(result);
                });
        },
        moreImages: function() {
            var self = this;
            var lastImageId = this.images[this.images.length - 1];

            axios.get("/moreimages/" + lastImageId.id).then(results => {
                self.images = [...self.images, ...results.data.images];
            });
        },
        openModal: function(CurimgId) {
            this.imageId = CurimgId;
        },
        closeTheModal: function() {
            this.imageId = null;
        },
        uploadFormIsVis: function(){
            this.uploadVis = true;
        },
        hideForm: function(){
            this.uploadVis = false;
        }
    }
});

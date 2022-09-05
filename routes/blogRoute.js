const router = require("express").Router()
const {verifyToken} = require("../middlewares/authMiddle")
const {
    get_shareblog,
    post_shareblog,
    get_allblogs,
    get_readblog,
    get_yourblogs,
    get_editblog,
    post_editblog,
    deleteblog,
}
= require("../controllers/blogController")

router.get("/share-blog", verifyToken, get_shareblog)
router.post("/share-blog", post_shareblog)
router.get("/all-blogs", get_allblogs)
router.get("/blog/:id", get_readblog)
router.get("/your-blogs", verifyToken, get_yourblogs)
router.get("/edit-blog/:id", verifyToken, get_editblog)
router.post("/edit-blog/:id", verifyToken, post_editblog)
router.get("/delete-blog/:id", verifyToken, deleteblog)

module.exports = router
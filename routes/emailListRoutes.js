const express = require("express");

const { updateEmailListTags, getEmailListTags, handleCheckDuplicates, getPaginatedEmailLists } = require("../controllers/emailListController");


const router = express.Router();

// to update tags of an email list send a patch request on route /api/email-lists/:id/tags with an array of tags
//tags already present in email list will be removed and new tags will be added
router.patch("/:id/tags", updateEmailListTags);

// to get tags of an email list send a get request on route /api/email-lists/:id a array of tags will be returned in response
router.get("/:id", getEmailListTags);


// Route to get paginated email lists
router.get("/", getPaginatedEmailLists);

router.post("/check-duplicates", handleCheckDuplicates);


module.exports = router;
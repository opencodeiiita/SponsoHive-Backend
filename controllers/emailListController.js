const EmailList = require("../models/EmailList");
const EmailTemplate = require("../models/EmailTemplate");
const User = require("../models/User");

// to update tags of an email list send a patch request on route /api/email-lists/:id/tags with an array of tags
//tags already present in email list will be removed and new tags will be added
const updateEmailListTags = async (req, res) => {
  const { id } = req.params;
  const { tags } = req.body; // array of strings

  if (!tags || tags.length === 0) {
    return res.status(400).json({ message: "Tags are required" });
  }

  try {
    const emailList = await EmailList.findById(id);
    if (!emailList) {
      return res.status(404).json({ message: "Email List not found" });
    }

    const newTags = tags.filter((tag) => !emailList.tags.includes(tag));
    emailList.tags = [...emailList.tags, ...newTags];

    const removeTags = emailList.tags.filter((tag) => !tags.includes(tag));
    emailList.tags = emailList.tags.filter((tag) => !removeTags.includes(tag));

    await emailList.save();
    return res.status(200).json({ message: "Tags updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// to get tags of an email list send a get request on route /api/email-lists/:id a array of tags will be returned in response
const getEmailListTags = async (req, res) => {
  const { id } = req.params;
  try {
    const emailList = await EmailList.findById(id);
    if (!emailList) {
      return res.status(404).json({ message: "Email List not found" });
    }
    return res.status(200).json({ tags: emailList.tags });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const isDuplicate = async (userId, title, subject, body, format) => {
  try {

      const duplicate = await EmailTemplate.findOne({
          userId,
          title,
          subject,
          format,
          body,
      });

      if (duplicate) {
          throw new Error('Duplicate entry found.');
      }
  } catch (error) {
      throw error;
  }
};


const handleCheckDuplicates = async (req, res) => {
  const { userId, title, subject, body, format, placeholders } = req.body;

  try {
    await isDuplicate(userId, title, subject, body, format);

    return res.status(200).send("No duplicates found.");
  } catch (error) {
    if (error.message === "Duplicate entry found.") {
      return res.status(409).send(error.message);
    }

// to get paginated email lists, on route /api/email-lists?page=1&limit=50
const getPaginatedEmailLists = async (req, res) => {
    try {
        console.log('GET /api/email-lists request received');  

    console.error(error);
    return res.status(500).send("Error checking for duplicates.");
  }
};


      // Extract page and limit query parameters, with defaults
      const page = parseInt(req.query.page) || 1; // Default page = 1
      const limit = parseInt(req.query.limit) || 10; // Default limit = 10
  
      if (page < 1 || limit < 1) {
        return res.status(400).json({ message: "Page and limit must be positive integers." });
      }
  
      const skip = (page - 1) * limit;

      const [data, totalItems] = await Promise.all([
        EmailList.find().skip(skip).limit(limit),
        EmailList.countDocuments() 
      ]);
  
      const totalPages = Math.ceil(totalItems / limit);

      res.status(200).json({
        success: true,
        data,
        meta: {
          currentPage: page,
          totalPages,
          totalItems,
          limit
        }
      });
    } catch (error) {
      console.error("Error fetching paginated email lists:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
module.exports = {
    getEmailListTags,
    getPaginatedEmailLists,

    updateEmailListTags,
    handleCheckDuplicates,
    isDuplicate,
};

const EmailList = require("../models/EmailList");


// to update tags of an email list send a patch request on route /api/email-lists/:id/tags with an array of tags
//tags already present in email list will be removed and new tags will be added
 const updateEmailListTags = async (req, res) => {
    const { id } = req.params;
    const { tags } = req.body; // array of strings

    if(!tags || tags.length === 0) {
        return res.status(400).json({ message: "Tags are required" });
    }
    
    try{
        const emailList = await EmailList.findById(id);
        if(!emailList) {
            return res.status(404).json({ message: "Email List not found" });
        }
        
        const newTags = tags.filter(tag => !emailList.tags.includes(tag));
        emailList.tags = [...emailList.tags, ...newTags];

        const removeTags = emailList.tags.filter(tag => !tags.includes(tag));
        emailList.tags = emailList.tags.filter(tag => !removeTags.includes(tag));

        await emailList.save();
        return res.status(200).json({ message: "Tags updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


// to get tags of an email list send a get request on route /api/email-lists/:id a array of tags will be returned in response
 const getEmailListTags = async (req, res) => {
    const { id } = req.params;
    try{
        const emailList = await EmailList.findById(id);
        if(!emailList) {
            return res.status(404).json({ message: "Email List not found" });
        }
        return res.status(200).json({ tags: emailList.tags });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = {
    updateEmailListTags,
    getEmailListTags
}
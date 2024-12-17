const EmailTemplate = require("../models/EmailTemplate");
const { isDuplicate } = require("./emailListController");

const createEmailTemplate = async (req, res) => {
  try {
    const { userId, title, subject, body, format, placeholders } = req.body;

    if (!userId || !title || !subject || !body) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await isDuplicate(userId, title, subject, body, format);

    const newTemplate = new EmailTemplate({
      userId,
      title,
      subject,
      body,
      format,
      placeholders,
    });

    const savedTemplate = await newTemplate.save();

    return res.status(201).json(savedTemplate);
  } catch (error) {
    if (error.message === "Duplicate entry found.") {
      return res.status(409).json({ error: error.message });
    }
    console.error("Error creating email template:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};

const getEmailTemplate = async (req, res) => {
  try {
    const { userId } = req.body;

    const templates = await EmailTemplate.find({ userId });

    res.status(200).json({
      message: "Templates fetched successfully.",
      data: templates,
    });
  } catch (error) {
    console.error("Error fetching templates:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the templates." });
  }
};

module.exports = { createEmailTemplate, getEmailTemplate };

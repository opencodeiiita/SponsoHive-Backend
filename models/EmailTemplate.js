const mongoose = require("mongoose");
const sanitizeHtml = require("sanitize-html");
const { JSDOM } = require("jsdom");

const EmailTemplateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    enum: ["text", "html"],
    default: "html",
  },
  placeholders: [
    {
      name: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const isValidHtml = (html) => {
  try {
    const { window } = new JSDOM(html);
    return true;
  } catch (error) {
    return false;
  }
};

EmailTemplateSchema.pre("save", function (next) {
  const template = this;

  if (template.format === "html") {
    try {
      template.body = sanitizeHtml(template.body, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "style"]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          a: ["href", "name", "target"],
          img: ["src", "alt", "title", "width", "height"],
        },
        allowedSchemes: ["http", "https", "mailto"],
      });

      if (!isValidHtml(template.body)) {
        return next(
          new Error("The provided HTML content is invalid or malformed.")
        );
      }

      if (!template.body.trim()) {
        return next(
          new Error("The provided HTML content is invalid or empty.")
        );
      }
    } catch (error) {
      return next(new Error("Error sanitizing HTML content: " + error.message));
    }
  }

  template.updatedAt = Date.now();
  next();
});

EmailTemplateSchema.statics.replacePlaceholders = function (
  body,
  placeholders
) {
  return body.replace(/{{\s*([\w.]+)\s*}}/g, (match, key) => {
    const placeholder = placeholders.find((p) => p.name === key);
    return placeholder ? placeholder.value : match;
  });
};

module.exports = mongoose.model("EmailTemplate", EmailTemplateSchema);

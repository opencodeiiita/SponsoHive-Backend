const multer = require('multer');
const { EmailList } = require('../models/EmailList');

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    cb(null, true);
  } else {
    cb(new Error('Only .csv and .xlsx files are allowed!'), false);
  }
};

const trackEmailResponse = async (emailId) => {
  const email = await EmailList.findById(emailId);

  if (email) {
    email.responded = true;  // Mark as responded
    await email.save();
  }
};

const upload = multer({ storage, fileFilter });
module.exports = { trackEmailResponse, upload };

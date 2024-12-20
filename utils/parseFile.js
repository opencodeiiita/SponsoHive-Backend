const csvParser = require('csv-parser');
const xlsx = require('xlsx');
const { validateEmail } = require('./validateEmail');

const parseFile = (fileBuffer, mimetype) => {
  const emails = [];
  const invalidRows = [];

  if (mimetype === 'text/csv') {
    const data = fileBuffer.toString();
    data.split('\n').forEach((line, index) => {
      const email = line.trim();
      if (validateEmail(email)) {
        emails.push(email);
      } else {
        invalidRows.push({ row: index + 1, value: email });
      }
    });
  } else if (mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    rows.forEach((row, index) => {
      const email = row[0]?.trim();
      if (validateEmail(email)) {
        emails.push(email);
      } else {
        invalidRows.push({ row: index + 1, value: email });
      }
    });
  }

  return { emails, invalidRows };
};

module.exports = parseFile;

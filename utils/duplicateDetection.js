


function detectDuplicates(emails) {
    const seen = new Set();
    const duplicates = new Set();
  
    emails.forEach((email) => {
      if (seen.has(email)) {
        duplicates.add(email);
      } else {
        seen.add(email);
      }
    });
  
    return Array.from(duplicates);
  }
  
  module.exports = { detectDuplicates };
  
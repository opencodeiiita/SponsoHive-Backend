function categorizeContacts(contacts) {
    const valid = [];
    const invalid = [];
    const duplicated = [];
  
    const seen = new Set();
  
    contacts.forEach((contact) => {
      if (contact.email && !seen.has(contact.email)) {
        if (isValidEmail(contact.email)) {
          valid.push(contact);
        } else {
          invalid.push(contact);
        }
        seen.add(contact.email);
      } else if (seen.has(contact.email)) {
        duplicated.push(contact);
      }
    });
  
    return { valid, invalid, duplicated };
  }
  
  function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }
  
  module.exports = categorizeContacts;
  
const categorizeContacts = require('../../utils/contactCategorization');

describe('Contact Categorization', () => {
  it('should categorize empty email list correctly', () => {
    const result = categorizeContacts([]);
    expect(result).toEqual({
      valid: [],
      invalid: [],
      duplicated: [],
    });
  });

  it('should categorize contacts correctly', () => {
    const contacts = [
      { email: 'valid@example.com' },
      { email: 'invalid-email' },
      { email: 'valid@example.com' },
    ];

    const result = categorizeContacts(contacts);
    expect(result).toEqual({
      valid: [{ email: 'valid@example.com' }],
      invalid: [{ email: 'invalid-email' }],
      duplicated: [{ email: 'valid@example.com' }],
    });
  });
});

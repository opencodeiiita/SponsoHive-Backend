const { detectDuplicates } = require('../../utils/duplicateDetection');

describe('Duplicate Detection Logic', () => {
  test('Detect duplicates in email array', () => {
    const emails = ['a@example.com', 'b@example.com', 'a@example.com'];
    const result = detectDuplicates(emails);
    expect(result).toEqual(['a@example.com']);
  });

  test('No duplicates in unique email array', () => {
    const emails = ['a@example.com', 'b@example.com', 'c@example.com'];
    const result = detectDuplicates(emails);
    expect(result).toEqual([]);
  });
});

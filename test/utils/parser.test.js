


const parseCSV = require('../../utils/csvParser');
const path = require('path');

describe('CSV Parser', () => {
  it('should correctly parse CSV file', async () => {
    const filePath = path.join(__dirname, 'sample.csv');
    const data = await parseCSV(filePath);

    expect(data).toEqual([
      { email: 'test1@example.com', name: 'John Doe' },
      { email: 'test2@example.com', name: 'Jane Doe' },
    ]);
  });
});

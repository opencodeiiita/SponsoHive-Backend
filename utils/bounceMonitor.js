const imaps = require('imap-simple');
const dotenv = require('dotenv');
const Recipient = require('../models/RecepientModel'); // Import Recipient model

dotenv.config();

// IMAP Configuration
const config = {
    imap:{
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASS,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: {
          rejectUnauthorized: false, // Allow self-signed certificates
        },
    }
};
  
async function updateBounce(){
    
    imaps.connect(config).then(connection => {
    
        return connection.openBox('INBOX').then(() => {
      
          const searchCriteria = ['UNSEEN', ['FROM', 'mailer-daemon@googlemail.com']]; // Fetch unread messages
          const fetchOptions = { bodies: ['HEADER', 'TEXT'], struct: true };
      
          return connection.search(searchCriteria, fetchOptions).then(async (messages) => { // Make the entire function async
            for (const item of messages) { // Use a for...of loop instead of forEach to handle async properly
      
              // Extract email body
              const bodyPart = item.parts.find(part => part.which === 'TEXT');
              const body = bodyPart ? bodyPart.body : '(No Body Content)';
      
              // Regular expression to match email addresses
              const emailPattern = /[a-zA-Z0-9._%+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      
              // Extract email addresses
              const emails = body.match(emailPattern);
      
              // Filter out emails containing a hyphen and the specific email to remove
              const validEmails = emails.filter(email => !email.includes('-') && email !== 'sponsohive@gmail.com');
      
              // Remove duplicates using a Set
              const uniqueValidEmails = [...new Set(validEmails)];
      
              // Print the results
              console.log(uniqueValidEmails);
      
              // Update recipients in the database
              for (const email of uniqueValidEmails) {
                const recipient = await Recipient.findOne({ email });
                if (recipient) {
                  recipient.status = 'Bounced';
                  recipient.updatedAt = new Date();
                  await recipient.save();
                  console.log(`Updated ${email} to Bounced`);
                }
              }
      
              // Mark the email as read
              await connection.addFlags(item.attributes.uid, ['\\Seen']);
              console.log('Email marked as read');
            }
      
            connection.end();
          });
        });
      }).catch(err => console.log('Error:', err));

}

module.exports = updateBounce;

  
  

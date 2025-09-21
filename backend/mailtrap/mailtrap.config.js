// mailtrap.config.js
const { MailtrapClient } = require("mailtrap");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const TOKEN = process.env.MAILTRAP_TOKEN;

if (!TOKEN) {
  console.error("❌ MAILTRAP_TOKEN is missing in .env file");
  process.exit(1);
}

// Create Mailtrap client
const mailtrapClient = new MailtrapClient({ token: TOKEN });

// Sender details
const sender = {
  email: "hello@demomailtrap.co",
  name: "Startup",
};

// Test function to send a sample email
async function testMailtrap() {
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: [{ email: "arpit.kumar232@lpu.in" }], // replace with your Mailtrap inbox email
      subject: "Mailtrap Test Email",
      text: "This is a test email sent from Node.js using Mailtrap!",
    });
    console.log("✅ Email sent successfully:", response);
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
  }
}

// Run test only if file is executed directly
if (require.main === module) {
  testMailtrap();
}

module.exports = { mailtrapClient, sender };

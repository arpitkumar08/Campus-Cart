const { Resend } = require("resend");
const dotenv = require("dotenv");
const { VERIFICATION_EMAIL_TEMPLATE } = require("./emailTemplates"); // make sure path is correct
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a verification email to the user using a custom HTML template
 * @param {string} email - Recipient email
 * @param {string} verificationCode - Verification code
 */
const sendVerificationEmail = async (email, verificationCode) => {
  try {

    // Replace the placeholder in the template with actual verification code
    const html = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationCode);

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify Your Email",
      html,
    });

  } catch (error) {
    console.error("❌ Error sending verification email:", error);
  }
};

module.exports = { sendVerificationEmail };

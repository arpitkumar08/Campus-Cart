const { Resend } = require("resend");
const dotenv = require("dotenv");
const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE } = require("./emailTemplates"); // ✅ Make sure this path is correct
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a verification email to the user using a custom HTML template
 * @param {string} email - Recipient email
 * @param {string} verificationCode - Verification code
 */
const sendVerificationEmail = async (email, verificationCode) => {
  try {
    // Replace placeholder in the template with actual verification code
    const html = VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verificationCode
    );

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

/**
 * Sends a password reset email with a reset link
 * @param {string} email - Recipient email
 * @param {string} resetLink - URL for password reset
 */
const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    // Replace placeholder in the template with the actual reset link
    const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetLink);

const response = await resend.emails.send({
  from: "onboarding@resend.dev",
  to: email,
  subject: "Reset Your Password",
  html,
});

  } catch (error) {
  console.error("❌ Error sending password reset email:", error);
}
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};

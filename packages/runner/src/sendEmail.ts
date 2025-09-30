import { Resend } from "resend";

if (!process.env.RESEND_TOKEN) {
  throw new Error("RESEND_TOKEN token not set");
}

const resend = new Resend(process.env.RESEND_TOKEN);

export const sendEmail = async (email: string, message: string) => {
  const wrappedMessage = `
${message}
<br />
<br />
<b>This message is not verified and could contain dangerous content!</b>`;

  await resend.emails.send({
    from: "notifications@luimey.dev",
    to: email,
    subject: "Pusher Notification",
    html: wrappedMessage,
  });
};

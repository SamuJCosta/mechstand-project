import nodemailer from "nodemailer";
import path from "path";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendResetEmail(to: string, token: string) {
  const resetUrl = `http://localhost:3001/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Recuperação de senha - MechStand",
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="background: #222; color: white; padding: 20px; text-align: center;">
            <img src="cid:logo" alt="MechStand Logo" width="100" style="margin-bottom: 10px; margin-left: 30px" />
            <h1 style="margin: 0; font-size: 24px;">MechStand</h1>
          </div>
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">Olá,</p>
            <p style="font-size: 16px;">
              Você solicitou a recuperação de senha para sua conta no MechStand.
            </p>
            <p style="font-size: 16px;">
              Clique no botão abaixo para redefinir sua senha. Este link é válido por <strong>1 hora</strong>.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a 
                href="${resetUrl}" 
                style="
                  background-color: #0070f3; 
                  color: white; 
                  padding: 12px 24px; 
                  text-decoration: none; 
                  border-radius: 5px; 
                  font-weight: bold;
                  display: inline-block;
                "
                target="_blank"
                rel="noopener noreferrer"
              >
                Redefinir Senha
              </a>
            </div>
            <p style="font-size: 14px; color: #777;">
              Se você não solicitou essa alteração, ignore este email.
            </p>
            <hr style="border:none; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 12px; color: #999; text-align: center;">
              &copy; ${new Date().getFullYear()} MechStand. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: 'logo.png',
        path: path.resolve('./public/logoblack.png'),
        cid: 'logo'
      }
    ]
  };

  await transporter.sendMail(mailOptions);
}

import nodemailer from "nodemailer";
import path from "path";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendWelcomeEmail(
  to: string,
  username: string,
  role: string,
  password: string
) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Bem-vindo ao MechStand",
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="background: #222; color: white; padding: 20px; text-align: center;">
            <img src="cid:logo" alt="MechStand Logo" width="100" style="margin-bottom: 10px; margin-left: 24px" />
            <h1 style="margin: 0; font-size: 24px;">MechStand</h1>
          </div>
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">Olá <strong>${username}</strong>,</p>
            <p style="font-size: 16px;">
              Sua conta no MechStand foi criada com sucesso com a role: <strong>${role}</strong>.
            </p>
            <p style="font-size: 16px;">
              Aqui estão suas credenciais de acesso temporárias:
            </p>
            <ul style="font-size: 16px; padding-left: 20px;">
              <li><strong>Username:</strong> ${username}</li>
              <li><strong>Senha temporária:</strong> ${password}</li>
            </ul>
            <p style="font-size: 16px;">
              Por favor, altere sua senha após o primeiro login para garantir a segurança da sua conta.
            </p>
            <p style="font-size: 14px; color: #777;">
              Se você não esperava esta conta, por favor ignore este email.
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
        filename: "logo.png",
        path: path.resolve("./public/LogoBlack.png"),
        cid: "logo",
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}

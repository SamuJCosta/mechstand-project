import nodemailer from "nodemailer"
import path from "path"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendReparacaoReagendadaEmail({
  to,
  username,
  novaData,
  titulo,
}: {
  to: string
  username: string
  novaData: string
  titulo: string
}) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Sua reparacao foi reagendada",
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="background: #222; color: white; padding: 20px; text-align: center;">
            <img src="cid:logo" alt="MechStand Logo" width="100" style="margin-bottom: 10px;" />
            <h1 style="margin: 0; font-size: 24px;">MechStand</h1>
          </div>
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">Olá <strong>${username}</strong>,</p>
            <p style="font-size: 16px;">A sua reparação "<strong>${titulo}</strong>" foi <strong>reagendada</strong>.</p>
            <p style="font-size: 16px;">Nova data agendada: <strong>${new Date(novaData).toLocaleString()}</strong>.</p>
            <p style="font-size: 14px; color: #777;">Se a nova data não funcionar para si, por favor entre em contacto com a oficina.</p>
            <hr style="border:none; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 12px; color: #999; text-align: center;">&copy; ${new Date().getFullYear()} MechStand. Todos os direitos reservados.</p>
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
  }
  await transporter.sendMail(mailOptions)
}

export async function sendReparacaoConcluidaEmail({
  to,
  username,
  titulo,
}: {
  to: string
  username: string
  titulo: string
}) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "A sua reparação está concluída – pode levantar o veículo",
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="background: #222; color: white; padding: 20px; text-align: center;">
            <img src="cid:logo" alt="MechStand Logo" width="100" style="margin-bottom: 10px;" />
            <h1 style="margin: 0; font-size: 24px;">MechStand</h1>
          </div>
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">Olá <strong>${username}</strong>,</p>
            <p style="font-size: 16px;">A reparação "<strong>${titulo}</strong>" foi concluída com sucesso.</p>
            <p style="font-size: 16px;">O seu veículo está pronto para ser levantado na oficina.</p>
            <p style="font-size: 14px; color: #777;">Agradecemos a sua confiança no MechStand!</p>
            <hr style="border:none; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 12px; color: #999; text-align: center;">&copy; ${new Date().getFullYear()} MechStand. Todos os direitos reservados.</p>
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
  }
  await transporter.sendMail(mailOptions)
}

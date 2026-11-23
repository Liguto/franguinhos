import nodemailer from 'nodemailer';

interface SubmissionEmailData {
  title: string;
  author: string;
  email: string;
  pixKey?: string;
  zipUrl: string;
  contractNumber: string;
  category: string;
  orientation: string;
  controls?: any;
  description?: string;
}

export async function sendSubmissionEmail(data: SubmissionEmailData): Promise<boolean> {
  // Lê as variáveis do ambiente de produção (Render / .env)
  const primaryEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'luizduarte_@live.com';
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM || 'KRUUJ Studio <onboarding@resend.dev>';
  const subject = `[KRUUJ Studio] 🎮 Nova Submissão de Jogo: "${data.title}" por ${data.author}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #050814; color: #f1f5f9; margin: 0; padding: 20px; }
        .card { background-color: #0b1024; border: 1.5px solid #38e8ff; border-radius: 16px; padding: 28px; max-width: 600px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 20px; }
        .title { color: #ffffff; font-size: 22px; font-weight: 900; margin: 0; }
        .badge { background: linear-gradient(135deg, #0284c7 0%, #8b5cf6 100%); color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 800; display: inline-block; margin-top: 8px; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px; }
        .info-table td { padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .label { color: #94a3b8; font-weight: bold; width: 140px; }
        .value { color: #f1f5f9; }
        .cta-btn { display: inline-block; background: linear-gradient(135deg, #38e8ff 0%, #8b5cf6 100%); color: #040817; text-decoration: none; padding: 14px 32px; border-radius: 9999px; font-weight: 900; font-size: 14px; text-align: center; margin: 10px 0; }
        .footer { text-align: center; font-size: 12px; color: #64748b; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div style="font-size: 32px; margin-bottom: 8px;">🦉</div>
          <h1 class="title">KRUUJ for Developers</h1>
          <span class="badge">NOVA SUBMISSÃO DE JOGO RECEBIDA</span>
        </div>

        <table class="info-table">
          <tr>
            <td class="label">Título do Jogo:</td>
            <td class="value"><strong style="color: #38e8ff; font-size: 16px;">${data.title}</strong></td>
          </tr>
          <tr>
            <td class="label">Criador / Estúdio:</td>
            <td class="value"><strong>${data.author}</strong></td>
          </tr>
          <tr>
            <td class="label">E-mail de Contato:</td>
            <td class="value"><a href="mailto:${data.email}" style="color: #38e8ff; text-decoration: none;">${data.email}</a></td>
          </tr>
          <tr>
            <td class="label">Protocolo Contratual:</td>
            <td class="value"><code style="background: rgba(168,85,247,0.2); color: #c084fc; padding: 2px 8px; border-radius: 6px; font-weight: bold;">${data.contractNumber}</code></td>
          </tr>
          <tr>
            <td class="label">Categoria:</td>
            <td class="value">${data.category}</td>
          </tr>
          <tr>
            <td class="label">Orientação:</td>
            <td class="value">${data.orientation}</td>
          </tr>
          <tr>
            <td class="label">Chave Pix (Repasse 70%):</td>
            <td class="value">${data.pixKey || 'Pendente (Opcional)'}</td>
          </tr>
          ${data.description ? `
          <tr>
            <td class="label" style="vertical-align: top;">Descrição / Gameplay:</td>
            <td class="value">${data.description}</td>
          </tr>
          ` : ''}
        </table>

        <div style="text-align: center; margin: 20px 0;">
          <a href="${data.zipUrl}" class="cta-btn" target="_blank">
            📦 Baixar Pacote ZIP do Jogo
          </a>
        </div>

        <div style="background: rgba(56, 232, 255, 0.05); border: 1px dashed rgba(56, 232, 255, 0.3); border-radius: 12px; padding: 14px; text-align: center; font-size: 13px; color: #cbd5e1;">
          <strong>Ação Recomendada:</strong> Acesse o Cockpit Administrativo do KRUUJ para testar e clicar em <code>✅ Aprovar & Publicar</code> para o jogo entrar no ar.
        </div>

        <div class="footer">
          KRUUJ Studio — Plataforma Oficial de Jogos Instantâneos<br>
          Este e-mail é uma notificação automática gerada pela rota de submissão do portal.
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. Tentar envio via Resend API (se RESEND_API_KEY estiver configurada)
  if (apiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [primaryEmail],
          subject,
          html: htmlContent
        })
      });

      if (res.ok) {
        console.log(`[Email] Notificação de submissão enviada via Resend para ${primaryEmail}`);
        return true;
      } else {
        const errorData = await res.json();
        console.warn('[Email] Erro resposta Resend:', errorData);

        // Se deu erro de sandbox por restrição de destinatário, envia com segurança para luizduarte_@live.com
        if (primaryEmail !== 'luizduarte_@live.com') {
          const retryRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: fromEmail,
              to: ['luizduarte_@live.com'],
              subject,
              html: htmlContent
            })
          });
          if (retryRes.ok) {
            console.log(`[Email] Notificação entregue com sucesso via fallback do Resend para luizduarte_@live.com`);
            return true;
          }
        }
      }
    } catch (e: any) {
      console.warn('[Email] Falha ao enviar via Resend API:', e.message);
    }
  }

  // 2. Tentar envio via SMTP / Gmail (se SMTP_USER e SMTP_PASS estiverem configurados)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: `"KRUUJ Studio" <${process.env.SMTP_USER}>`,
        to: primaryEmail,
        subject,
        html: htmlContent
      });

      console.log(`[Email] Notificação de submissão enviada via SMTP para ${primaryEmail}`);
      return true;
    } catch (e: any) {
      console.warn('[Email] Falha ao enviar via SMTP:', e.message);
    }
  }

  return false;
}

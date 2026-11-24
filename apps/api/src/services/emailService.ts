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

  // Template com estilos 100% INLINE e alto contraste (compatível com Outlook, Live.com e Gmail Dark Mode)
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <title>Nova Submissão de Jogo - KRUUJ Studio</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #050814; font-family: 'Segoe UI', Arial, sans-serif; color: #ffffff;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #050814; padding: 20px 0;">
        <tr>
          <td align="center">
            
            <!-- CARD PRINCIPAL -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0c1229; border: 2px solid #38e8ff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
              
              <!-- CABEÇALHO -->
              <tr>
                <td align="center" style="padding: 28px 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); background-color: #080d1f;">
                  <div style="font-size: 36px; line-height: 1; margin-bottom: 10px;">🦉</div>
                  <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: 0.5px;">KRUUJ for Developers</h1>
                  <div style="margin-top: 8px;">
                    <span style="display: inline-block; background-color: #0284c7; color: #ffffff !important; font-size: 11px; font-weight: 900; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
                      Nova Submissão de Jogo Recebida
                    </span>
                  </div>
                </td>
              </tr>

              <!-- CORPO COM DADOS -->
              <tr>
                <td style="padding: 24px 28px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); width: 140px; color: #94a3b8; font-size: 13px; font-weight: bold;">
                        Título do Jogo:
                      </td>
                      <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #38e8ff !important; font-size: 16px; font-weight: 900;">
                        ${data.title}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 13px; font-weight: bold;">
                        Criador / Autor:
                      </td>
                      <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #ffffff !important; font-size: 14px; font-weight: bold;">
                        ${data.author}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 13px; font-weight: bold;">
                        E-mail de Contato:
                      </td>
                      <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #38e8ff !important; font-size: 14px;">
                        <a href="mailto:${data.email}" style="color: #38e8ff !important; text-decoration: underline; font-weight: bold;">${data.email}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 13px; font-weight: bold;">
                        Protocolo Contrato:
                      </td>
                      <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #c084fc !important; font-size: 14px; font-family: monospace; font-weight: bold;">
                        ${data.contractNumber}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 13px; font-weight: bold;">
                        Categoria:
                      </td>
                      <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #ffffff !important; font-size: 14px;">
                        ${data.category}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 13px; font-weight: bold;">
                        Orientação:
                      </td>
                      <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #ffffff !important; font-size: 14px;">
                        ${data.orientation}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 13px; font-weight: bold;">
                        Chave Pix (70%):
                      </td>
                      <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #34d399 !important; font-size: 14px; font-weight: bold;">
                        ${data.pixKey || 'Pendente (Opcional)'}
                      </td>
                    </tr>
                    ${data.description ? `
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 13px; font-weight: bold; vertical-align: top;">
                        Descrição:
                      </td>
                      <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #cbd5e1 !important; font-size: 13px; line-height: 1.5;">
                        ${data.description}
                      </td>
                    </tr>
                    ` : ''}
                  </table>

                  <!-- SEÇÃO DE DOWNLOAD DO ZIP EM ALTO CONTRASTE -->
                  <div style="margin: 28px 0 20px; text-align: center;">
                    <div style="font-size: 12px; font-weight: bold; color: #94a3b8; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">
                      Arquivo ZIP do Jogo para Testes
                    </div>
                    
                    <!-- BOTÃO BULLETPROOF: FUNDO CIANO VIBRANTE COM TEXTO PRETO PURO -->
                    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                      <tr>
                        <td align="center" style="border-radius: 50px; background-color: #38e8ff;">
                          <a href="${data.zipUrl}" target="_blank" style="display: inline-block; background-color: #38e8ff; color: #000000 !important; font-family: Arial, sans-serif; font-size: 15px; font-weight: 900; text-decoration: none; padding: 15px 36px; border-radius: 50px; border: 2px solid #38e8ff; text-align: center;">
                            <span style="color: #000000 !important; font-weight: 900; letter-spacing: 0.5px;">
                              📦 BAIXAR ARQUIVO .ZIP DO JOGO
                            </span>
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- CAIXA COM LINK DIRETO (LEGÍVEL EM QUALQUER CLIENTE) -->
                    <div style="margin-top: 14px; background-color: #162044; border: 1px solid #38e8ff; border-radius: 10px; padding: 12px 16px; text-align: left; word-break: break-all;">
                      <span style="display: block; font-size: 11px; font-weight: bold; color: #94a3b8; margin-bottom: 4px;">Link direto para download:</span>
                      <a href="${data.zipUrl}" target="_blank" style="color: #38e8ff !important; font-size: 13px; font-weight: bold; text-decoration: underline; font-family: monospace;">
                        ${data.zipUrl}
                      </a>
                    </div>
                  </div>

                  <!-- AVISO DE APROVAÇÃO -->
                  <div style="background-color: rgba(56, 232, 255, 0.08); border: 1px dashed rgba(56, 232, 255, 0.4); border-radius: 12px; padding: 14px 18px; margin-top: 20px; text-align: center;">
                    <span style="color: #ffffff; font-size: 13px; line-height: 1.5; display: block;">
                      ⚙️ <strong>Como Publicar:</strong> Acesse a <strong>Área Administrativa (Cockpit)</strong> do KRUUJ, confira os arquivos e clique em <strong style="color: #34d399;">✅ Aprovar & Publicar</strong> para o jogo entrar no ar no site!
                    </span>
                  </div>

                </td>
              </tr>

              <!-- RODAPÉ -->
              <tr>
                <td align="center" style="padding: 16px 24px; background-color: #070b18; border-top: 1px solid rgba(255,255,255,0.06);">
                  <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.4;">
                    KRUUJ Studio — Plataforma Oficial de Jogos Instantâneos<br>
                    Notificação automática emitida pelo sistema de submissões de desenvolvedores.
                  </p>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // 1. Tentar envio via Resend API
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

  // 2. Tentar envio via SMTP / Gmail
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

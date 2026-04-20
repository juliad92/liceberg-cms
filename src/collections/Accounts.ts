import { CollectionConfig } from 'payload'

const Accounts: CollectionConfig = {
  slug: 'accounts',
  auth: {
    useAPIKey: true,
    forgotPassword: {
      // Payload sends this email automatically when hitting /api/accounts/forgot-password
      // Customize the email template here
      generateEmailHTML: async ({ req, token, user }: any) => {
        const resetURL = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`

        return `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin:0;padding:0;background:#f5f0e8;font-family:'Helvetica Neue',Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 20px;">
              <tr>
                <td align="center">
                  <table width="520" cellpadding="0" cellspacing="0" style="background:white;border-radius:12px;overflow:hidden;">
 
                    <!-- Header -->
                    <tr>
                      <td style="background:#9b8ec4;padding:32px;text-align:center;">
                        <p style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:900;font-style:italic;color:white;letter-spacing:-0.02em;">
                          L'Iceberg
                        </p>
                        <p style="margin:6px 0 0;font-size:11px;color:rgba(255,255,255,0.7);letter-spacing:0.12em;text-transform:uppercase;">
                          La revue
                        </p>
                      </td>
                    </tr>
 
                    <!-- Body -->
                    <tr>
                      <td style="padding:40px 40px 32px;">
                        <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:22px;font-style:italic;color:#3a3050;">
                          Réinitialisation de votre mot de passe
                        </h1>
                        <p style="margin:0 0 12px;font-size:15px;color:#5a5070;line-height:1.7;">
                          Bonjour,
                        </p>
                        <p style="margin:0 0 24px;font-size:15px;color:#5a5070;line-height:1.7;">
                          Vous avez demandé à réinitialiser votre mot de passe pour votre compte
                          <strong style="color:#3a3050;">L'Iceberg</strong>.
                          Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.
                        </p>
 
                        <!-- CTA -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="padding:8px 0 32px;">
                              <a href="${resetURL}"
                                style="display:inline-block;background:#e8634a;color:white;
                                       padding:14px 36px;border-radius:4px;text-decoration:none;
                                       font-weight:700;font-size:14px;letter-spacing:0.08em;
                                       text-transform:uppercase;">
                                Réinitialiser mon mot de passe
                              </a>
                            </td>
                          </tr>
                        </table>
 
                        <!-- Warning -->
                        <div style="background:#fdf0ed;border-left:3px solid #e8634a;padding:12px 16px;border-radius:0 4px 4px 0;margin-bottom:24px;">
                          <p style="margin:0;font-size:13px;color:#7a3020;line-height:1.6;">
                            ⏱️ Ce lien est valable pendant <strong>1 heure</strong>.
                            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email —
                            votre mot de passe restera inchangé.
                          </p>
                        </div>
 
                        <!-- Fallback link -->
                        <p style="margin:0;font-size:12px;color:#9b8ec4;line-height:1.6;">
                          Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
                          <a href="${resetURL}" style="color:#9b8ec4;word-break:break-all;">${resetURL}</a>
                        </p>
                      </td>
                    </tr>
 
                    <!-- Footer -->
                    <tr>
                      <td style="background:#f5f0e8;padding:24px 40px;border-top:1px solid #e8e4f0;">
                        <p style="margin:0;font-size:12px;color:#9b8ec4;text-align:center;line-height:1.6;">
                          Cet email vous a été envoyé car vous avez un compte sur
                          <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#7b6db0;">liceberg.fr</a>.<br>
                          © L'Iceberg — La revue des grands défis écologiques
                        </p>
                      </td>
                    </tr>
 
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
      },
      generateEmailSubject: () =>
        "Réinitialisation de votre mot de passe — L'Iceberg",
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: [
      'email',
      'name',
      'firstName',
      'stripeCustomerId',
      'createdAt',
    ],
  },
  access: {
    create: () => true, // ← inscription publique depuis le site
    read: () => true, // false ?
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Rempli automatiquement après le premier achat',
      },
    },
    {
      name: 'resetToken',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'resetTokenExpiry',
      type: 'date',
      admin: { hidden: true },
    },
  ],
}

export default Accounts

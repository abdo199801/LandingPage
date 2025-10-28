// src/app/api/send-email/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    // Extraire les données du corps de la requête
    const body = await request.json();
    console.log('📨 Données reçues:', body);

    const { 
      nom = '', 
      email = '', 
      telephone = '', 
      niveau = '', 
      message = '', 
      horsHeures = false 
    } = body;

    // Validation des données requises
    if (!nom || !email || !telephone || !niveau || !message) {
      console.error('❌ Données manquantes:', { nom, email, telephone, niveau, message });
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Configuration du transporteur EmailJS (gratuit)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Vérifier la connexion SMTP
    await transporter.verify();

    // Email pour l'administrateur - CORRIGÉ avec le message
    const adminEmail = {
      from: process.env.SMTP_USER,
      to: 'abdobaq777@gmail.com', // Remplacez par votre email
      subject: `🎯 Nouvelle inscription Polaris.K - ${nom}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0F377A;">🎯 Nouvelle demande d'inscription Polaris.K</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #F58723; margin-bottom: 15px;">Informations du candidat :</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; width: 120px;">Nom complet :</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${nom}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email :</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                  <a href="mailto:${email}" style="color: #0F377A;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Téléphone :</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                  <a href="tel:${telephone}" style="color: #0F377A;">${telephone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Niveau scolaire :</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${niveau}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Disponibilité :</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                  ${horsHeures ? 'Hors heures (week-ends)' : 'Heures normales'}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Date :</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                  ${new Date().toLocaleString('fr-FR')}
                </td>
              </tr>
            </table>
          </div>

          <!-- SECTION MESSAGE AJOUTÉE ICI -->
          <div style="background: #f0f7ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #0F377A;">
            <h3 style="color: #0F377A; margin-bottom: 15px;">📝 Message du candidat :</h3>
            <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e1e5e9;">
              <p style="color: #333; line-height: 1.6; margin: 0; white-space: pre-wrap; font-style: normal;">
                ${message}
              </p>
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 10px; margin-bottom: 0;">
              Longueur du message: ${message.length} caractères
            </p>
          </div>

          <div style="margin-top: 25px; padding: 15px; background: #e8f5e8; border-radius: 8px;">
            <p style="margin: 0; color: #2d5016; font-weight: bold;">
              ⚡ Action requise : Contacter le candidat sous 24h
            </p>
            <p style="margin: 5px 0 0 0; color: #2d5016; font-size: 14px;">
              📞 <strong>${telephone}</strong> | 📧 <a href="mailto:${email}" style="color: #0F377A;">${email}</a>
            </p>
          </div>

          <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #F58723;">
            <p style="color: #666; font-size: 12px;">
              Cet email a été envoyé automatiquement depuis le formulaire d'inscription Polaris.K
            </p>
          </div>
        </div>
      `,
    };

    // Email de confirmation pour l'utilisateur - CORRIGÉ avec le message
    const userEmail = {
      from: process.env.SMTP_USER,
      to: email,
      subject: '🎯 Confirmation de votre inscription - Polaris.K',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px 0;">
            <h1 style="color: #0F377A; margin: 0;">Polaris<span style="color: #F58723;">.K</span></h1>
            <p style="color: #666; margin: 5px 0;">Formation d'Excellence à Distance</p>
          </div>

          <div style="background: linear-gradient(135deg, #0F377A, #1a4ba5); color: white; padding: 30px; border-radius: 15px; text-align: center;">
            <h2 style="margin: 0 0 15px 0;">🎉 Merci pour votre inscription !</h2>
            <p style="margin: 0; font-size: 18px;">Votre demande a été reçue avec succès</p>
          </div>

          <div style="padding: 25px;">
            <p style="color: #333;">Bonjour <strong>${nom}</strong>,</p>
            
            <p style="color: #333; line-height: 1.6;">
              Nous avons bien reçu votre demande d'inscription à la formation <strong>Polaris.K</strong> 
              et nous vous en remercions. Notre équipe va étudier votre dossier et vous contactera 
              très prochainement pour finaliser votre inscription.
            </p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #F58723; margin-top: 0;">📋 Récapitulatif de votre demande :</h3>
              <ul style="color: #333; line-height: 1.8;">
                <li><strong>Nom :</strong> ${nom}</li>
                <li><strong>Email :</strong> ${email}</li>
                <li><strong>Téléphone :</strong> ${telephone}</li>
                <li><strong>Niveau :</strong> ${niveau}</li>
                <li><strong>Formation :</strong> Polaris.K - Gestion & Management</li>
                <li><strong>Mode :</strong> 100% à distance</li>
                <li><strong>Session :</strong> Novembre 2025</li>
              </ul>
            </div>

            <!-- SECTION MESSAGE AJOUTÉE ICI POUR L'UTILISATEUR -->
            <div style="background: #fff4e6; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #F58723;">
              <h4 style="color: #F58723; margin-top: 0;">💬 Votre message :</h4>
              <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #ffe4c4;">
                <p style="color: #333; line-height: 1.6; margin: 0; white-space: pre-wrap;">
                  ${message}
                </p>
              </div>
            </div>

            <div style="background: #fff4e6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #F58723; margin-top: 0;">🔄 Prochaines étapes :</h4>
              <ol style="color: #333; line-height: 1.6;">
                <li><strong>Sous 24h :</strong> Appel de notre équipe pour valider votre profil</li>
                <li><strong>J+2 :</strong> Réception de votre dossier d'inscription complet</li>
                <li><strong>J+3 :</strong> Accès à votre espace formation</li>
              </ol>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #666; margin-bottom: 20px;">
                Vous avez des questions ? Contactez-nous directement :
              </p>
              <div style="display: inline-block; text-align: left;">
                <p style="margin: 5px 0;">📞 <strong>0530 44 93 98 / 0665 08 92 76</strong></p>
                <p style="margin: 5px 0;">📧 <strong>polarisprivateinstitute@gmail.com</strong></p>
                <p style="margin: 5px 0;">📍 <strong>Angle Rue Maâmoura & Reine Élisabeth, Kénitra</strong></p>
              </div>
            </div>

            <div style="border-top: 2px solid #F58723; padding-top: 20px; text-align: center;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                À très bientôt dans la famille Polaris.K !<br>
                <strong>L'équipe Polaris.K</strong>
              </p>
            </div>
          </div>
        </div>
      `,
    };

    // Envoi des emails
    console.log('📤 Envoi des emails...');
    console.log('📝 Longueur du message:', message.length, 'caractères');
    
    await transporter.sendMail(adminEmail);
    console.log('✅ Email admin envoyé à abdobaq777@gmail.com');
    
    await transporter.sendMail(userEmail);
    console.log('✅ Email utilisateur envoyé à:', email);

    return NextResponse.json(
      { 
        message: 'Emails envoyés avec succès',
        details: {
          adminEmail: 'abdobaq777@gmail.com',
          userEmail: email,
          messageLength: message.length
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erreur complète:', error);
    console.error('📝 Données reçues lors de l\'erreur:', body);
    
    return NextResponse.json(
      { 
        error: `Erreur lors de l'envoi des emails: ${error.message}`,
        receivedData: body 
      },
      { status: 500 }
    );
  }
}
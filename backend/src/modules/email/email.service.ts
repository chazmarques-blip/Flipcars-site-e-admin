import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Lead } from '@database/entities/lead.entity';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const emailConfig = {
      host: this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('SMTP_PORT', 587),
      secure: this.configService.get<boolean>('SMTP_SECURE', false),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    };

    this.logger.log('📧 Initializing email transporter...');
    this.logger.log(`SMTP Host: ${emailConfig.host}:${emailConfig.port}`);
    this.logger.log(`SMTP User: ${emailConfig.auth.user}`);

    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
      this.logger.warn('⚠️ SMTP credentials not configured. Email sending will fail.');
      this.logger.warn('⚠️ Please set SMTP_USER and SMTP_PASS environment variables.');
    }

    this.transporter = nodemailer.createTransport(emailConfig);
  }

  /**
   * Send a generic email
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // Check if SMTP is configured
      const smtpUser = this.configService.get<string>('SMTP_USER');
      const smtpPass = this.configService.get<string>('SMTP_PASS');
      
      if (!smtpUser || !smtpPass || smtpUser === 'your-email@gmail.com') {
        this.logger.warn('⚠️ SMTP not configured. Skipping email send.');
        return false;
      }

      const from = this.configService.get<string>(
        'SMTP_FROM',
        '"FlipCars Auto Repair" <noreply@flipcars.us>',
      );

      this.logger.log(`📤 Sending email to ${options.to}`);
      this.logger.log(`Subject: ${options.subject}`);

      // Add timeout to prevent hanging (5 seconds)
      const emailPromise = this.transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Email timeout after 5 seconds')), 5000);
      });

      const info = await Promise.race([emailPromise, timeoutPromise]) as any;

      this.logger.log(`✅ Email sent successfully! MessageId: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error('❌ Failed to send email:', error.message);
      return false;
    }
  }

  /**
   * Send estimate confirmation email to customer
   * FIXED: Using current Lead entity schema (name, vehicleYear, vehicleMake, vehicleModel)
   */
  async sendEstimateConfirmation(lead: Lead): Promise<boolean> {
    this.logger.log(
      `📧 Preparing estimate confirmation email for ${lead.name}`,
    );

    const subject = `Estimate Request Confirmation - ${lead.referenceNumber}`;
    
    // Build vehicle info from current schema
    const vehicleInfo = [lead.vehicleYear, lead.vehicleMake, lead.vehicleModel]
      .filter(Boolean)
      .join(' ') || 'N/A';
    
    const preferredDateFormatted = lead.preferredDate
      ? new Date(lead.preferredDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'To be scheduled';

    const html = `
      <h1>Thank you for your estimate request!</h1>
      <p>Dear ${lead.name},</p>
      <p>We have received your estimate request and will contact you shortly.</p>
      <h3>Request Details:</h3>
      <ul>
        <li><strong>Reference:</strong> ${lead.referenceNumber}</li>
        <li><strong>Vehicle:</strong> ${vehicleInfo}</li>
        <li><strong>Preferred Date:</strong> ${preferredDateFormatted}</li>
        <li><strong>Phone:</strong> ${lead.phone}</li>
      </ul>
      <p>Best regards,<br>FlipCars Auto Repair Team</p>
    `;
    
    const text = `
Thank you for your estimate request!

Dear ${lead.name},

We have received your estimate request and will contact you shortly.

Request Details:
- Reference: ${lead.referenceNumber}
- Vehicle: ${vehicleInfo}
- Preferred Date: ${preferredDateFormatted}
- Phone: ${lead.phone}

Best regards,
FlipCars Auto Repair Team
    `;

    return this.sendEmail({
      to: lead.email,
      subject,
      html,
      text,
    });
  }

  /**
   * Send AI estimate email to customer
   * FIXED: Using current Lead entity schema
   */
  async sendAIEstimate(lead: Lead, estimateDetails: any): Promise<boolean> {
    this.logger.log(
      `📧 Preparing AI estimate email for ${lead.name}`,
    );

    const subject = `Your Auto Repair Estimate - ${lead.referenceNumber}`;
    
    const vehicleInfo = [lead.vehicleYear, lead.vehicleMake, lead.vehicleModel]
      .filter(Boolean)
      .join(' ') || 'N/A';

    const html = `
      <h1>Your Auto Repair Estimate</h1>
      <p>Dear ${lead.name},</p>
      <p>Thank you for choosing FlipCars Auto Repair. Here is your estimate:</p>
      <h3>Vehicle Information:</h3>
      <p>${vehicleInfo}</p>
      <h3>Estimate Details:</h3>
      <p>${JSON.stringify(estimateDetails, null, 2)}</p>
      <p>Reference: ${lead.referenceNumber}</p>
      <p>Best regards,<br>FlipCars Auto Repair Team</p>
    `;
    
    const text = `
Your Auto Repair Estimate

Dear ${lead.name},

Thank you for choosing FlipCars Auto Repair. Here is your estimate:

Vehicle: ${vehicleInfo}
Reference: ${lead.referenceNumber}

Best regards,
FlipCars Auto Repair Team
    `;

    return this.sendEmail({
      to: lead.email,
      subject,
      html,
      text,
    });
  }
}

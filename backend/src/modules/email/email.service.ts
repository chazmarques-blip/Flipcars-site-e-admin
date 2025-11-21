import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Lead } from '@database/entities/lead.entity';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content?: Buffer | string;
    path?: string;
    contentType?: string;
  }>;
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
        attachments: options.attachments,
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
   * Send enhanced confirmation email with printable HTML attachment
   */
  async sendPrintableConfirmation(lead: Lead): Promise<boolean> {
    this.logger.log(
      `📧 Preparing printable confirmation email for ${lead.name}`,
    );

    const subject = `Estimate Request Confirmation - ${lead.referenceNumber}`;
    
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

    const submittedDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Email body (customer-friendly version)
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); color: #D4AF37; padding: 20px; text-align: center; border-radius: 8px; }
          .content { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .reference { font-size: 24px; font-weight: bold; color: #D4AF37; letter-spacing: 2px; margin: 10px 0; }
          .info-row { margin: 10px 0; }
          .label { font-weight: 600; color: #666; }
          .value { color: #000; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 2px solid #D4AF37; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 ESTIMATE REQUEST CONFIRMED</h1>
            <p style="margin: 0; opacity: 0.9;">${lead.serviceType === 'bodyshop' ? 'Body Shop Repair Service' : 'Mechanic Service'}</p>
          </div>
          
          <div class="content">
            <p>Dear <strong>${lead.name}</strong>,</p>
            <p>Thank you for choosing FlipCars Auto Repair! We have received your estimate request and will contact you shortly.</p>
            
            <h3 style="color: #000; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Your Reference Number</h3>
            <div class="reference">${lead.referenceNumber}</div>
            <p style="font-size: 12px; color: #666;">Please save this number for your records</p>
            
            <h3 style="color: #000; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; margin-top: 20px;">Request Details</h3>
            <div class="info-row">
              <span class="label">Submitted:</span>
              <span class="value">${submittedDate}</span>
            </div>
            <div class="info-row">
              <span class="label">Vehicle:</span>
              <span class="value">${vehicleInfo}</span>
            </div>
            <div class="info-row">
              <span class="label">Preferred Date:</span>
              <span class="value">${preferredDateFormatted}</span>
            </div>
            <div class="info-row">
              <span class="label">Phone:</span>
              <span class="value">${lead.phone}</span>
            </div>
            
            <h3 style="color: #000; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; margin-top: 20px;">What Happens Next?</h3>
            <ol style="margin: 15px 0; padding-left: 20px;">
              <li style="margin: 8px 0;"><strong>Review</strong> - We'll review your request within 1 hour</li>
              <li style="margin: 8px 0;"><strong>Contact</strong> - We'll reach out via your preferred method</li>
              <li style="margin: 8px 0;"><strong>Service</strong> - We'll confirm your appointment and provide estimate</li>
            </ol>
            
            <div style="background: #fff; padding: 15px; border-left: 4px solid #D4AF37; margin-top: 20px;">
              <h4 style="margin: 0 0 10px 0; color: #000;">📍 Our Location</h4>
              <p style="margin: 5px 0;">FlipCars Auto Repair</p>
              <p style="margin: 5px 0;">5200 Old Winter Garden Rd, Suite 110A<br>Orlando, FL 32811</p>
              <p style="margin: 5px 0;"><strong>Phone:</strong> (321) 960-8661</p>
              <p style="margin: 5px 0; font-size: 12px; color: #666;">Mon-Fri 9:00 AM - 6:00 PM | Sat 9:00 AM - 12:00 PM | Sunday Closed</p>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Thank you for choosing FlipCars Auto Repair!</strong></p>
            <p>We look forward to serving you.</p>
            <p style="margin-top: 10px;">Please keep this email for your records.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Thank you for your estimate request!

Dear ${lead.name},

We have received your estimate request and will contact you shortly.

REFERENCE NUMBER: ${lead.referenceNumber}
(Please save this number for your records)

Request Details:
- Submitted: ${submittedDate}
- Vehicle: ${vehicleInfo}
- Preferred Date: ${preferredDateFormatted}
- Phone: ${lead.phone}

What Happens Next?
1. Review - We'll review your request within 1 hour
2. Contact - We'll reach out via your preferred method
3. Service - We'll confirm your appointment and provide estimate

Our Location:
FlipCars Auto Repair
5200 Old Winter Garden Rd, Suite 110A
Orlando, FL 32811
Phone: (321) 960-8661
Hours: Mon-Fri 9:00 AM - 6:00 PM | Sat 9:00 AM - 12:00 PM | Sunday Closed

Thank you for choosing FlipCars Auto Repair!
We look forward to serving you.
    `;

    return this.sendEmail({
      to: lead.email,
      subject,
      html: emailHtml,
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

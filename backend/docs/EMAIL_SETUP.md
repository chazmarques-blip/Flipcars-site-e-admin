# Email Configuration Guide

This guide explains how to configure automated email sending for estimate confirmations.

## 📧 Overview

When a customer submits an estimate request, FlipCars automatically sends a professional confirmation email with:
- Reference number for tracking
- Customer and vehicle details
- Appointment information
- What happens next (3-step process)
- FlipCars location and contact info
- Professional branding (black/gold theme)

## 🔧 Configuration Steps

### Option 1: Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication**
   - Go to your Google Account: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Visit: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other" as the device, name it "FlipCars"
   - Google will generate a 16-character password
   - **IMPORTANT**: Copy this password immediately (you won't see it again)

3. **Configure Environment Variables**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   SMTP_FROM="FlipCars Auto Repair" <noreply@flipcars.us>
   ```

4. **Restart Backend**
   ```bash
   cd backend
   npm run start:dev
   ```

### Option 2: SendGrid (Recommended for Production)

1. **Create SendGrid Account**
   - Visit: https://sendgrid.com/
   - Sign up for free account (100 emails/day free tier)

2. **Generate API Key**
   - Go to Settings → API Keys
   - Create API Key with "Mail Send" permissions
   - Copy the API key

3. **Configure Environment Variables**
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   SMTP_FROM="FlipCars Auto Repair" <noreply@flipcars.us>
   ```

4. **Verify Sender Email**
   - In SendGrid, go to Settings → Sender Authentication
   - Verify your "from" email address

### Option 3: AWS SES (For High Volume)

1. **Set up AWS SES**
   - Go to AWS Console → SES
   - Verify domain or email address
   - Move out of sandbox mode (request production access)

2. **Create SMTP Credentials**
   - In SES Console → SMTP Settings
   - Create SMTP credentials
   - Note the SMTP endpoint, username, and password

3. **Configure Environment Variables**
   ```env
   SMTP_HOST=email-smtp.us-east-1.amazonaws.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-aws-smtp-username
   SMTP_PASS=your-aws-smtp-password
   SMTP_FROM="FlipCars Auto Repair" <noreply@flipcars.us>
   ```

### Option 4: Office 365

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-password
SMTP_FROM="FlipCars Auto Repair" <noreply@flipcars.us>
```

## ✅ Testing Email Configuration

1. **Start Backend**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Check Logs on Startup**
   You should see:
   ```
   📧 Initializing email transporter...
   SMTP Host: smtp.gmail.com:587
   SMTP User: your-email@gmail.com
   ```

3. **Submit Test Estimate**
   - Go to http://localhost:3000
   - Fill out estimate form
   - Submit and check console logs:
   ```
   [LeadsService] 📧 Sending printable confirmation email to: customer@example.com
   📤 Sending email to customer@example.com
   Subject: Estimate Request Confirmation - FLIP-YYYYMMDD-XXXX
   ✅ Email sent successfully!
   [LeadsService] ✅ Printable confirmation email sent successfully
   ```

4. **Check Customer Email**
   - Customer should receive professional HTML email
   - Email is fully printable and mobile-responsive
   - Contains all lead details and reference number

## 🚨 Troubleshooting

### Error: "Authentication failed"
- **Gmail**: Make sure you're using App Password, not regular password
- **2FA**: Ensure 2-Factor Authentication is enabled
- **Less Secure Apps**: Gmail no longer supports this; MUST use App Password

### Error: "Email timeout after 5 seconds"
- Check internet connection
- Verify SMTP_HOST and SMTP_PORT are correct
- Try different SMTP port (465 for secure, 587 for TLS)

### Emails Not Being Received
- Check spam/junk folder
- Verify SMTP_FROM email is correct
- For SendGrid/SES: Verify sender email address in provider dashboard
- Check email provider's sending limits

### Gmail Daily Limit
- Free Gmail: 500 emails/day
- Google Workspace: 2,000 emails/day
- For higher volume, use SendGrid or AWS SES

## 📊 Email Delivery Status

The backend logs show email status:
- ✅ `Email sent successfully` - Email was accepted by SMTP server
- ⚠️ `SMTP not configured` - Missing SMTP credentials
- ❌ `Failed to send email` - SMTP error occurred

**Note**: Lead creation will succeed even if email fails. Email errors are logged but don't block lead creation.

## 🎨 Email Design

The confirmation email includes:
- **Header**: FlipCars branding with black/gold gradient
- **Reference Number**: Large, prominent, easy to save
- **Request Details**: Customer info, vehicle, appointment
- **What's Next**: 3-step process explanation
- **Location Info**: Full address, phone, business hours
- **Professional Footer**: Thank you message and branding

The email is:
- ✅ Mobile-responsive
- ✅ Print-friendly
- ✅ Professional design
- ✅ Matches website branding
- ✅ Contains all necessary information

## 🔐 Security Best Practices

1. **Never commit credentials**
   - Keep `.env` out of git
   - Use `.env.example` for templates only

2. **Use App Passwords**
   - Never use regular Gmail password
   - Generate unique App Password for FlipCars

3. **Rotate Credentials**
   - Change SMTP passwords periodically
   - Revoke old App Passwords when not needed

4. **Production Setup**
   - Use dedicated email service (SendGrid/SES)
   - Set up SPF, DKIM, DMARC records
   - Monitor email delivery rates
   - Set up bounce/complaint handling

## 📈 Scaling for Production

For production deployment:

1. **Use Professional Email Service**
   - SendGrid (99% deliverability, analytics)
   - AWS SES (cost-effective, scalable)
   - Mailgun (developer-friendly)

2. **Domain Authentication**
   - Verify custom domain
   - Set up SPF record
   - Configure DKIM
   - Add DMARC policy

3. **Monitoring**
   - Track delivery rates
   - Monitor bounce rates
   - Set up alerts for failures
   - Log all email attempts

4. **Email Templates**
   - Consider using provider's template system
   - A/B test email content
   - Track open/click rates
   - Optimize for mobile devices

## 📝 Current Email Implementation

- **Service**: `backend/src/modules/email/email.service.ts`
- **Method**: `sendPrintableConfirmation(lead: Lead)`
- **Trigger**: Automatically after lead creation
- **Timeout**: 5 seconds to prevent hanging
- **Graceful Failure**: Logs error but doesn't block lead creation

## 🔗 Resources

- [Gmail App Passwords](https://myaccount.google.com/apppasswords)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Email Deliverability Best Practices](https://sendgrid.com/blog/email-deliverability-best-practices/)

---

**Need Help?** Check backend logs for detailed error messages and troubleshooting hints.

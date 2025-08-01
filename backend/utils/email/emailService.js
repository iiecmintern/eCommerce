const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs").promises;
const path = require("path");

class EmailService {
  constructor() {
    this.transporter = null;
    this.templates = {};
    this.initialized = false;
  }

  async initialize() {
    if (!this.initialized) {
      await this.initializeTransporter();
      await this.loadTemplates();
      this.initialized = true;
    }
  }

  // Initialize email transporter
  async initializeTransporter() {
    try {
      // For development/testing, use Ethereal Email (fake SMTP for testing)
      if (process.env.NODE_ENV === "development" || !process.env.SMTP_USER) {
        this.transporter = await this.createEtherealTransporter();
      } else {
        // For production, use real SMTP (Gmail, SendGrid, etc.)
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: parseInt(process.env.SMTP_PORT) || 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        // Verify connection configuration
        await this.transporter.verify();
        console.log("✅ Email service initialized with SMTP");
      }
    } catch (error) {
      console.error("❌ Email service initialization failed:", error.message);
      // Fallback to Ethereal for testing
      this.transporter = await this.createEtherealTransporter();
    }
  }

  // Load email templates
  async loadTemplates() {
    const templatesDir = path.join(__dirname, "templates");
    try {
      const templateFiles = await fs.readdir(templatesDir);

      for (const file of templateFiles) {
        if (file.endsWith(".hbs")) {
          const templateName = file.replace(".hbs", "");
          const templatePath = path.join(templatesDir, file);
          const templateContent = await fs.readFile(templatePath, "utf8");
          this.templates[templateName] = handlebars.compile(templateContent);
        }
      }
    } catch (error) {
      console.log("Templates directory not found, using inline templates");
      this.createInlineTemplates();
    }
  }

  // Create inline templates if template files don't exist
  createInlineTemplates() {
    this.templates = {
      orderConfirmation: handlebars.compile(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
            .order-details { background: #fff; padding: 20px; margin: 20px 0; border: 1px solid #ddd; border-radius: 8px; }
            .item { padding: 10px 0; border-bottom: 1px solid #eee; }
            .total { font-weight: bold; font-size: 18px; margin-top: 20px; }
            .button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Order Confirmed!</h1>
              <p>Thank you for your order, {{customerName}}!</p>
            </div>
            
            <div class="order-details">
              <h2>Order #{{orderNumber}}</h2>
              <p><strong>Order Date:</strong> {{orderDate}}</p>
              <p><strong>Status:</strong> {{orderStatus}}</p>
              
              <h3>Items Ordered:</h3>
              {{#each items}}
              <div class="item">
                <strong>{{name}}</strong><br>
                {{#if variant}}Variant: {{variant}}<br>{{/if}}
                Quantity: {{quantity}} × ₹{{price}} = ₹{{total}}
              </div>
              {{/each}}
              
              <div class="total">
                <p><strong>Subtotal:</strong> ₹{{subtotal}}</p>
                <p><strong>Total:</strong> ₹{{total}}</p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="{{orderUrl}}" class="button">View Order Details</a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              If you have any questions, please contact our support team.
            </p>
          </div>
        </body>
        </html>
      `),

      passwordReset: handlebars.compile(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
            .button { display: inline-block; padding: 12px 24px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            
            <p>Hello {{userName}},</p>
            
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{resetUrl}}" class="button">Reset Password</a>
            </div>
            
            <p><strong>This link will expire in 15 minutes.</strong></p>
            
            <p>If you didn't request this password reset, please ignore this email.</p>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              For security reasons, this link will expire in 15 minutes.
            </p>
          </div>
        </body>
        </html>
      `),

      orderStatusUpdate: handlebars.compile(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
            .status { padding: 10px; border-radius: 5px; text-align: center; font-weight: bold; }
            .status.shipped { background: #d4edda; color: #155724; }
            .status.delivered { background: #d1ecf1; color: #0c5460; }
            .button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📦 Order Status Update</h1>
            </div>
            
            <p>Hello {{customerName}},</p>
            
            <p>Your order status has been updated:</p>
            
            <div class="status {{orderStatus}}">
              <h2>Order #{{orderNumber}} - {{orderStatus}}</h2>
            </div>
            
            {{#if trackingNumber}}
            <p><strong>Tracking Number:</strong> {{trackingNumber}}</p>
            {{/if}}
            
            {{#if estimatedDelivery}}
            <p><strong>Estimated Delivery:</strong> {{estimatedDelivery}}</p>
            {{/if}}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{orderUrl}}" class="button">View Order Details</a>
            </div>
          </div>
        </body>
        </html>
      `),

      welcomeEmail: handlebars.compile(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to CommerceForge</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
            .button { display: inline-block; padding: 12px 24px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to CommerceForge!</h1>
            </div>
            
            <p>Hello {{userName}},</p>
            
            <p>Welcome to CommerceForge! We're excited to have you as part of our community.</p>
            
            <p>Here's what you can do with your new account:</p>
            <ul>
              <li>Browse our extensive product catalog</li>
              <li>Shop with secure checkout</li>
              <li>Track your orders in real-time</li>
              <li>Manage your profile and preferences</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{loginUrl}}" class="button">Start Shopping</a>
            </div>
            
            <p>If you have any questions, our support team is here to help!</p>
          </div>
        </body>
        </html>
      `),
    };
  }

  // Send email with template
  async sendEmail(to, subject, templateName, data) {
    try {
      await this.initialize();

      if (!this.templates[templateName]) {
        throw new Error(`Template '${templateName}' not found`);
      }

      const html = this.templates[templateName](data);

      const mailOptions = {
        from: process.env.FROM_EMAIL || "noreply@commerceforge.com",
        to: to,
        subject: subject,
        html: html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to}: ${result.messageId}`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("Email sending failed:", error);
      return { success: false, error: error.message };
    }
  }

  // Send order confirmation email
  async sendOrderConfirmation(order, customer) {
    const data = {
      customerName: customer.firstName,
      orderNumber: order._id,
      orderDate: new Date(order.createdAt).toLocaleDateString(),
      orderStatus: order.status,
      items: order.items.map((item) => ({
        name: item.name,
        variant: item.variantCombination,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
      })),
      subtotal: order.subtotal,
      total: order.total,
      orderUrl: `${process.env.FRONTEND_URL}/orders/${order._id}`,
    };

    return await this.sendEmail(
      customer.email,
      `Order Confirmation #${order._id}`,
      "orderConfirmation",
      data
    );
  }

  // Send password reset email
  async sendPasswordReset(user, resetToken) {
    const data = {
      userName: user.firstName,
      resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
    };

    return await this.sendEmail(
      user.email,
      "Password Reset Request",
      "passwordReset",
      data
    );
  }

  // Send order status update email
  async sendOrderStatusUpdate(
    order,
    customer,
    newStatus,
    trackingNumber = null
  ) {
    const data = {
      customerName: customer.firstName,
      orderNumber: order._id,
      orderStatus: newStatus,
      trackingNumber: trackingNumber,
      estimatedDelivery: newStatus === "shipped" ? "3-5 business days" : null,
      orderUrl: `${process.env.FRONTEND_URL}/orders/${order._id}`,
    };

    return await this.sendEmail(
      customer.email,
      `Order Status Update #${order._id}`,
      "orderStatusUpdate",
      data
    );
  }

  // Send welcome email
  async sendWelcomeEmail(user) {
    const data = {
      userName: user.firstName,
      loginUrl: `${process.env.FRONTEND_URL}/login`,
    };

    return await this.sendEmail(
      user.email,
      "Welcome to CommerceForge!",
      "welcomeEmail",
      data
    );
  }

  // Create Ethereal transporter for testing
  async createEtherealTransporter() {
    try {
      // Create test account
      const testAccount = await nodemailer.createTestAccount();

      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      console.log("✅ Ethereal test account created for email testing");
      console.log("📧 Test email account:", testAccount.user);
      console.log("🔑 Test email password:", testAccount.pass);

      return transporter;
    } catch (error) {
      console.error("❌ Failed to create Ethereal transporter:", error.message);
      throw error;
    }
  }

  // Test email service
  async testEmailService() {
    const testData = {
      customerName: "Test User",
      orderNumber: "TEST123",
      orderDate: new Date().toLocaleDateString(),
      orderStatus: "confirmed",
      items: [
        {
          name: "Test Product",
          variant: "Red-Large",
          quantity: 1,
          price: 100,
          total: 100,
        },
      ],
      subtotal: 100,
      total: 100,
      orderUrl: "http://localhost:8080/orders/TEST123",
    };

    return await this.sendEmail(
      "test@example.com",
      "Test Email",
      "orderConfirmation",
      testData
    );
  }
}

module.exports = new EmailService();

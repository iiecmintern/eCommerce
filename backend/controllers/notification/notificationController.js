const emailService = require("../../utils/email/emailService");
const User = require("../../models/user/User");
const Order = require("../../models/order/Order");

class NotificationController {
  // Send order confirmation email
  async sendOrderConfirmation(req, res) {
    try {
      const { orderId } = req.params;

      const order = await Order.findById(orderId).populate("user");
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      const result = await emailService.sendOrderConfirmation(
        order,
        order.user
      );

      if (result.success) {
        res.json({
          success: true,
          message: "Order confirmation email sent successfully",
          messageId: result.messageId,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to send order confirmation email",
          error: result.error,
        });
      }
    } catch (error) {
      console.error("Order confirmation email error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Send order status update email
  async sendOrderStatusUpdate(req, res) {
    try {
      const { orderId } = req.params;
      const { newStatus, trackingNumber } = req.body;

      const order = await Order.findById(orderId).populate("user");
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      const result = await emailService.sendOrderStatusUpdate(
        order,
        order.user,
        newStatus,
        trackingNumber
      );

      if (result.success) {
        res.json({
          success: true,
          message: "Order status update email sent successfully",
          messageId: result.messageId,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to send order status update email",
          error: result.error,
        });
      }
    } catch (error) {
      console.error("Order status update email error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Send password reset email
  async sendPasswordReset(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Generate reset token (this should be done in auth controller)
      const resetToken = require("crypto").randomBytes(32).toString("hex");

      const result = await emailService.sendPasswordReset(user, resetToken);

      if (result.success) {
        res.json({
          success: true,
          message: "Password reset email sent successfully",
          messageId: result.messageId,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to send password reset email",
          error: result.error,
        });
      }
    } catch (error) {
      console.error("Password reset email error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Send welcome email
  async sendWelcomeEmail(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const result = await emailService.sendWelcomeEmail(user);

      if (result.success) {
        res.json({
          success: true,
          message: "Welcome email sent successfully",
          messageId: result.messageId,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to send welcome email",
          error: result.error,
        });
      }
    } catch (error) {
      console.error("Welcome email error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Test email service
  async testEmailService(req, res) {
    try {
      const result = await emailService.testEmailService();

      if (result.success) {
        res.json({
          success: true,
          message: "Test email sent successfully",
          messageId: result.messageId,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to send test email",
          error: result.error,
        });
      }
    } catch (error) {
      console.error("Test email error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Send bulk notification (for admin use)
  async sendBulkNotification(req, res) {
    try {
      const { subject, templateName, data, userIds } = req.body;

      if (!subject || !templateName || !data || !userIds) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: subject, templateName, data, userIds",
        });
      }

      const users = await User.find({ _id: { $in: userIds } });
      const results = [];

      for (const user of users) {
        const result = await emailService.sendEmail(
          user.email,
          subject,
          templateName,
          { ...data, userName: user.firstName }
        );
        results.push({
          userId: user._id,
          email: user.email,
          success: result.success,
          messageId: result.messageId,
          error: result.error,
        });
      }

      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.length - successCount;

      res.json({
        success: true,
        message: `Bulk notification sent. Success: ${successCount}, Failed: ${failureCount}`,
        results,
      });
    } catch (error) {
      console.error("Bulk notification error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = new NotificationController();

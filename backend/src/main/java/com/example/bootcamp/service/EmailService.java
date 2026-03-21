package com.example.bootcamp.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * ส่ง Email แจ้งเตือนเมื่อมีคำสั่งซื้อใหม่ไปยังตัวแทนจำหน่าย
     */
    public void sendNewOrderNotification(String toEmail, String orderNumber, String customerName, BigDecimal totalAmount, String urlPath) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("📦 มีคำสั่งซื้อใหม่เข้ามา! [Order #" + orderNumber + "]");

            String formattedAmount = NumberFormat.getCurrencyInstance(new Locale("th", "TH")).format(totalAmount);

            String content = "<html><body style='font-family: sans-serif;'>" +
                    "<div style='max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;'>" +
                    "  <div style='background: linear-gradient(to right, #2563eb, #4f46e5); padding: 24px; text-align: center;'>" +
                    "    <h1 style='color: white; margin: 0; font-size: 20px;'>New Order Notification</h1>" +
                    "  </div>" +
                    "  <div style='padding: 24px; color: #1e293b;'>" +
                    "    <p>สวัสดีครับ/ค่ะ,</p>" +
                    "    <p>มีคำสั่งซื้อใหม่เข้ามาในร้านค้าของคุณ:</p>" +
                    "    <div style='background-color: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #f1f5f9;'>" +
                    "      <p style='margin: 4px 0;'><strong>เลขที่ออเดอร์:</strong> " + orderNumber + "</p>" +
                    "      <p style='margin: 4px 0;'><strong>ลูกค้า:</strong> " + customerName + "</p>" +
                    "      <p style='margin: 4px 0;'><strong>ยอดรวม:</strong> " + formattedAmount + "</p>" +
                    "    </div>" +
                    "    <p style='margin-top: 24px;'>กรุณาเข้าสู่ระบบหน้า Reseller Portal เพื่อตรวจสอบและดำเนินการออเดอร์</p>" +
                    (urlPath != null && !urlPath.isEmpty() ? 
                    "    <div style='text-align: center; margin-top: 24px;'>" +
                    "      <a href='" + urlPath + "' style='background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;'>เข้าสู่ระบบจัดการออเดอร์</a>" +
                    "    </div>" : "") +
                    "    <hr style='border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;'>" +
                    "    <p style='font-size: 12px; color: #94a3b8; text-align: center;'>— ระบบแจ้งเตือนอัตโนมัติ (Automated Notification)</p>" +
                    "  </div>" +
                    "</div>" +
                    "</body></html>";

            helper.setText(content, true);
            mailSender.send(message);

            System.out.println("✅ Email notification sent to: " + toEmail);
        } catch (MessagingException e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
            // ในสถานการณ์จริงอาจต้องทำ retry logic หรือแจ้งเตือน admin
        }
    }
}

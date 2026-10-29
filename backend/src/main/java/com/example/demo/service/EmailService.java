package com.example.demo.service;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
@Service
public class EmailService {
  private final ObjectProvider<JavaMailSender> sender;
  public EmailService(ObjectProvider<JavaMailSender> s) { this.sender = s; }
  public void send(String to, String subject, String text) {
    try {
      JavaMailSender s = sender.getIfAvailable();
      if (s == null) return;
      SimpleMailMessage m = new SimpleMailMessage();
      m.setTo(to); m.setSubject(subject); m.setText(text);
      s.send(m);
    } catch (Exception e) { System.err.println("Email failed: " + e.getMessage()); }
  }
}

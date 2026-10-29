package com.example.demo;
import java.util.TimeZone;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
@SpringBootApplication @EnableScheduling
public class DemoApplication {
  public static void main(String[] a) { TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata")); SpringApplication.run(DemoApplication.class, a); }
}

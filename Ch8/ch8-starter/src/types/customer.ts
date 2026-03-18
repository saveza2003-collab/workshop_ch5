import { AllPayments, AllPaymentsForm } from "./payment";

/**
 * โครงสร้างข้อมูล (Interface) ของลูกค้า (Customer) 
 * ใช้เมื่อข้อมูล "ผ่านการตรวจสอบเสร็จสมบูรณ์แล้ว" 
 * ดังนั้น payments ตัวนี้จะเป็นข้อมูลที่สมบูรณ์และแปลงค่าตัวเลขไว้เรียบร้อยครับ
 */
export interface Customer {
    name: string;
    payments: AllPayments; // มั่นใจได้ว่าข้อมูลการชำระเงินสมบูรณ์และถูกต้องตามวิธีใดวิธีหนึ่ง
    isVerified: boolean;
}

/**
 * โครงสร้างข้อมูลก่อนผ่านการตรวจสอบ (CustomerForm)
 * ใช้เสมือนช่องรับของเวลาดึงมาจากหน้าเว็บ ซึ่งทุกอย่างยัง "ดิบๆ" อยู่
 * เช่น payments.amount อาจจะยังเป็น string จากช่อง Input
 */
export interface CustomerForm {
    name: string;
    payments: AllPaymentsForm; // ใช้ข้อมูลดิบของระบบจ่ายเงิน
    isVerified: boolean;
}

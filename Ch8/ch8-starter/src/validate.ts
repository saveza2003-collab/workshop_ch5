import { Customer, CustomerForm } from "./types/customer";
import { AllPayments, AllPaymentsForm } from "./types/payment";

/**
 * ฟังก์ชันช่วยเหลือ (Helper Function) สำหรับดักจับค่าว่างเปล่า (null, undefined, "" และอื่นๆ)
 * ความพิเศษคือการใช้ `asserts condition` ซึ่งแปลว่าถ้าไม่เกิด Error (ผ่านเงื่อนไขไปได้)
 * TypeScript จะถือว่า condition นั้นเป็นจริงตลอดไป ช่วยลดการเตือนกวนใจเวลาเขียนโปรแกรมบรรทัดล่างๆ 
 */
export function assertNonEmpty(condition: unknown, message: string): asserts condition {
    if (condition === null || condition === undefined || condition === "") {
        throw new Error(message)
    }
}

/**
 * ตรวจสอบความสมบูรณ์ของ "ลูกค้า" (Customer Validate)
 * รับข้อมูลดิบลูกค้ายกแผง (CustomerForm) แล้วคัดกรองแปลงออกมาเป็น Customer เนื้อแท้
 */
export function validateCustomer(customer: CustomerForm): Customer {
    // 1. ตรวจสอบชื่อ
    if (!customer.name) {
        throw new Error('Name is required') // ถ้าไม่ใส่ ให้หยุดการทำงานแล้วปาหน้าต่างแจ้งเตือนทันที!
    }
    
    // 2. ตรวจสอบ Checkbox ยืนยันข้อมูล
    if (customer.isVerified === undefined) {
        throw new Error('Verified is required')
    }
    
    /* 
     * 3. ปั้นข้อมูลกลับออกไป
     * สังเกตว่าในส่วน payments นั้น ทางด่านหน้าพยายามโยนข้อมูลที่ได้จากฟอร์มเข้ามาเป็น string
     * สิ่งที่คุณต้องทำคือ นำก้อนนั้นส่งต่อให้ validatePayment ตรวจอีกที 
     * และรอรับผลลัพธ์เป็น AllPayments เพื่อใส่ลงไป 
     */
    return {
        name: customer.name,
        isVerified: customer.isVerified,
        payments: validatePayment(customer.payments)
    }
}  

/**
 * ตรวจสอบความสมบูรณ์ของการ "จ่ายเงิน" (Payment Validate)
 * แปลงข้อมูลจาก Form (หน้าเว็บ) ให้กลายเป็นประเภทเงิน Payment ที่ระบบอนุมัติใช้งาน
 */
export function validatePayment(payment: AllPaymentsForm): AllPayments {
    // 1. ฟิลด์พื้นฐานสองตัวนี้ ห้ามเว้นว่างเด็ดขาด!
    assertNonEmpty(payment.type, "Payment type is required")
    assertNonEmpty(payment.amount, "Payment amount is required")
    
    // 2. พยายามแปลงเลขตัวหนังสือเป็นตัวเลขจริงๆ (Casting)
    const amount = Number(payment.amount)
    if (isNaN(amount) || amount <= 0) {
        throw new Error("Invalid payment amount") // ห้ามจ่ายติดลบ หรือจ่ายด้วยการพิมพ์ตัวอักษร ABC
    }

    // 3. ตรวจสอบเงื่อนไขตาม "รูปแบบการจ่ายเงิน (payment.type)" ที่ผู้ใช้เลือกมาจาก Dropdown!
    if (payment.type === "Cash") {
        // อนุมัติการจ่ายเงินสด (ไม่มีส่วนแนกขยาย)
        return {
            amount: amount,
            type: "cash",
            metadata: undefined
        }

    } else if (payment.type === "OnlineBanking") {
        // ขอใช้ any เพื่อเข้าถึง metadata ชั่วคราว (เนื่องจากโครงสร้างดิบมันปะปนข้อมูลกันอยู่)
        const metadata = payment.metadata as any;
        
        // ขาดสองช่องนี้ ถือว่าข้อมูลไม่ครบ
        assertNonEmpty(metadata?.accountNumber, "Account number is required")
        assertNonEmpty(metadata?.bankName, "Bank name is required")
        
        // อนุมัติการจ่ายโอนบัญชี! พร้อมรีเทิร์นเลขบัญชี
        return {
            amount: amount,
            type: "OnlineBanking",
            metadata: {
                accountNumber: metadata.accountNumber,
                bankName: metadata.bankName
            }
        }

    } else if (payment.type === "CreditCard") {
        const metadata = payment.metadata as any;

        // ขาดสองช่องนี้ การชำระเครดิตการ์ดล้มเหลว
        assertNonEmpty(metadata?.cardNumber, "Card number is required")
        assertNonEmpty(metadata?.cardHolderName, "Card holder name is required")
        
        // อนุมัติการจ่ายผ่านบัตรเครดิต! 
        return {
            amount: amount,
            type: "Creditcard",
            metadata: {
                cardNumber: metadata.cardNumber,
                cardHolderName: metadata.cardHolderName
            }
        }
    }
    
    // หากพิมพ์ Type ตัวเลือกช่องมั่ว หลุดขอบเขตมาจากหน้าบ้าน จะเจอนี่ดักเอาไว้
    throw new Error("Invalid payment method")
}
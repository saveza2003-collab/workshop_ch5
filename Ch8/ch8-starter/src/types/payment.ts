/**
 * เป็น Interface แม่แบบกลาง (Base) สำหรับรูปแบบการชำระเงินทุกอย่าง
 * โดยมีการใช้ Generics (<TType, TMetadata>) ไว้เพื่อให้สามารถยัดข้อมูลพิเศษแตกแขนงออกไปได้
 */
export interface BasePayment<TType extends string, TMetadata = undefined> {
  type: TType;
  amount: number; // จำนวนเงินจะถูกเก็บและยึดถือเป็นตัวเลข (number) เท่านั้น
  metadata: TMetadata; // ข้อมูลพิเศษอื่นๆ ซึ่งบางวิธีอาจจะไม่มี (เป็น undefined)
}

/**
 * 1. ประเภทเงินสด (Cash)
 * ระบุ type เป็น 'cash' ตายตัว และ metadata เป็น undefined เพราะจ่ายเงินสดไม่ต้องเก็บเลขที่อะไรเพิ่ม
 */
export type Cash = BasePayment<'cash', undefined>

/**
 * 2. ประเภทบัตรเครดิต (Credit Card)
 * ต้องมีกล่อง (Interface) สำหรับเก็บรวบรวมข้อมูลบัตรเพิ่มขึ้นมา
 */
export interface CreditCardMetadata {
  cardNumber: string
  cardHolderName: string
}
export type CreditCard = BasePayment<'Creditcard', CreditCardMetadata>

/**
 * 3. ประเภทโอนผ่านธนาคารออนไลน์ (Online Banking)
 * ต้องมีกล่องสำหรับเก็บตระกร้าเลขบัญชีและชื่อธนาคาร
 */
export interface OnlineBankingMetadata {
  accountNumber: string
  bankName: string   
}
export type OnlineBanking = BasePayment<'OnlineBanking', OnlineBankingMetadata>

/**
 * AllPayments คือการนำรูปแบบการจ่ายเงินทั้งหมดมาต่อกันด้วย "Union Type" (|)
 * ทำให้ตัวแปรที่ครอบด้วยประเภท AllPayments สามารถเป็นอะไรก็ได้ใน 3 แบบนี้
 */
export type AllPayments = Cash | CreditCard | OnlineBanking

/**
 * AllPaymentsForm คือหน้าตาของข้อมูลดิบเวลาหลุดมาจากฟอร์ม HTML ครบถ้วน
 * (ก่อนที่จะถูก Validate ต่อไปใน validatePayment)
 * สังเกตว่า amount จากหน้าเว็บจะมาเป็น string เสมอ 
 * ส่วน metadata เราใช้ Partial<> เพื่อบอกว่า "ชิ้นส่วนข้างในอาจจะมีมาไม่ครบหรือไม่มีก็ได้" เพราะแต่ละวิธีจ่ายข้อมูลเก็บไม่เหมือนกันครับ
 */
export type AllPaymentsForm = {
    type: string
    amount: string
    metadata: Partial<CreditCardMetadata | OnlineBankingMetadata>
}
// คลาสแม่ (Abstract) สำหรับการจ่ายเงินทุกแบบ
abstract class Payment {
    protected amount: number = 0; // ยอดเงิน
    protected iscash: boolean = false; // เอาไว้เช็กว่าเป็นเงินสดไหม
    
    // get ยอดเงิน
    public getAmount(): number {
        return this.amount;
    }
    
    // ดูว่าจ่ายเป็นเงินสดหรือเปล่า
    public isCashPayMent(): boolean {
        return this.iscash;
    }
    
    // เช็กสถานะว่าจ่ายผ่านไหม (คลาสลูกต้องเอาไปเขียนต่อ)
    public abstract isPaymentsuccess(): boolean; 
}
    
// --- คลาสจ่ายเงินด้วยเงินสด ---
class Cashpayment extends Payment {
    constructor() {
        super();
        this.iscash = true; // เซ็ตให้รู้ว่าเป็นเงินสด
    }
    
    // หยอดเหรียญ/แบงก์เพิ่ม
    public addMoney(cash: number) {
        this.amount += cash; 
    }
    
    // ถ้าหยอดเงินสด ถือว่าจ่ายสำเร็จเลย
    public isPaymentsuccess(): boolean {
        return true; 
    }
}

// --- คลาสจ่ายเงินด้วย QR Code ---
class QRCodePayment extends Payment {
    // รับยอดเงินที่ต้องสแกน
    public payWithQRCode(amount: number): void {
        this.amount = amount;
    }
    
    // สุ่มว่าสแกนจ่ายผ่านไหม (จำลองยิง API ธนาคาร)
    public isPaymentsuccess(): boolean {
       const random = Math.floor(Math.random() * 10);
       return random > 3; // ผ่าน 70% ร่วง 30%
    }
}

// --- คลาสตู้ขายของ (Vending Machine) ---
class VenningMaching {
    // price = ราคาสินค้า, Amount = จำนวนของในตู้, totalCash = เงินในตู้ที่มีไว้ทอน
    constructor(private price: number, private Amount: number, private totalCash: number) {}
    
    // เช็กของหมด
    private isOutofstock(): boolean {
        return this.Amount <= 0;
    }
    
    // เช็กว่าตังค์พอซื้อไหม
    private isPayEnough(amount: number): boolean {
        return this.price <= amount;
    }
    
    // คิดเงินทอน
    private calculateChange(amount: number): number {
        return amount - this.price;
    }
    
    // เช็กเงินในตู้ว่าพอทอนไหม
    private isEnoughChange(changeAmount: number): boolean {
        return this.totalCash >= changeAmount;
    }
    
    // *** ฟังก์ชันหลักตอนกดจ่ายเงิน ***
    public pay(payment: Payment) {
        // 1. เช็กก่อนของหมดไหม
        if (this.isOutofstock()){
            throw new Error("สินค้าหมดแล้ว");
        }
        
        // 2. เช็กว่าตังค์พอซื้อไหม
        if (!this.isPayEnough(payment.getAmount())){
            throw new Error("เงินไม่พอ");
        }
        
        // คำนวณเงินทอนรอก่อนเลย
        const change = this.calculateChange(payment.getAmount());

        // 3. ถ้าจ่ายเงินสด ต้องเช็กด้วยว่าตู้มีเงินทอนพอไหม
        if (!this.isEnoughChange(change) && payment.isCashPayMent()) {
            throw new Error("เงินทอนไม่พอ");
        }
        
        // 4. เช็กว่าสถานะจ่ายเงินผ่านจริงๆ รึเปล่า (เผื่อสแกน QR ละเน็ตหลุด)
        if (!payment.isPaymentsuccess()){
            throw new Error("การชำระเงินไม่สำเร็จ");
        }
       
        // หักของในตู้ออก 1 ชิ้น
        this.Amount -= 1;

        // ถ้าจ่ายเงินสด ค่อยเอาเงินเก็บเข้าตู้ แล้วคิดเงินทอน
        if (payment.isCashPayMent()){
            this.totalCash += this.price; // เก็บยอดเข้าตู้
        
            if (change > 0){
                return `ทอนเงิน ${change} บาท, กำลังส่งมอบสินค้า`; // คืนเงินทอน
            }
        }
        
        // ถ้าเป็น QR Code หรือไม่มีเงินทอน ก็ให้ของไปเลย
        return `กำลังส่งมอบสินค้า`;
    }
} 

// -------- ลองเทสดู --------

// สร้างตู้: ของชิ้นละ 10 บาท, มี 20 ชิ้น, ตู้มีเงินทอน 30 บาท
const vendingMachine = new VenningMaching(10, 20, 30);

// เทสคนที่ 1: หยอดเงินสด 15 บาท (5+10)
const cashPayment = new Cashpayment();
cashPayment.addMoney(5);  
cashPayment.addMoney(10); 

const result = vendingMachine.pay(cashPayment);
console.log("เงินสด: " + result);

// เทสคนที่ 2: สแกน QR Code 10 บาท
const qrPayment = new QRCodePayment();
qrPayment.payWithQRCode(10); 
const resultQr = vendingMachine.pay(qrPayment);
console.log("QR Code: " + resultQr);



class Cashpayment {
    private amount: number =  0; // ยอดเงินที่ลูกค้าหยอดมา

    // ฟังก์ชันสำหรับยอดเงินเพิ่มเข้ามา
    public addMoney(cash:number){
        this.amount += cash;
    }
    
    // ฟังก์ชันสำหรับดูยอดเงินทั้งหมดที่ลูกค้าหยอดเข้ามา
    public getAmount(): number {
        return this.amount;
    }
}

// คลาสตัวแทนของ "ตู้ขายของอัตโนมัติ"
class VenningMaching{
    // กำหนดค่าเริ่มต้นตอนสร้างตู้ขายของ: 
    // price = ราคาสินค้า, Amount = จำนวนสินค้าในตู้, totalCash = เงินที่ตู้มีไว้ทอน
    constructor (private price:number, private Amount: number, private totalCash:number ){}
    
    // ตรวจสอบว่าสินค้าหมดรึเปล่า (ดูว่าจำนวนของ <= 0 ไหม)
    private isOutofstock():boolean{
        return this.Amount <= 0;
    }
    
    // ตรวจสอบว่าลูกค้าจ่ายเงินพอไหม (เงินที่จ่ายมา >= ราคาสินค้าไหม)
    private isPayEnough(amount:number):boolean{
        return this.price <= amount;
    }
    
    // คำนวณเงินทอน (เอาเงินที่ลูกค้าจ่าย - ราคาสินค้า)
    private calculateChange(amount:number):number{
        return amount-this.price;
    }
    
    // ตรวจสอบว่าตู้มีเงินทอนพอไหม (เงินในตู้ >= เงินทอนที่จะต้องจ่ายไหม)
    private isEnoughChange(changeAmount:number):boolean{
        return this.totalCash >= changeAmount;
    }
    
    // ระบบตอนลูกค้าทำการ "กดจ่ายเงิน" (รับรับข้อมูลกระเป๋าเงินของลูกค้าเข้ามาเช็ก)
    public pay (payment:Cashpayment){
        // 1. เช็กก่อนว่ามีสินค้าขายไหม
        if(this.isOutofstock()){
            throw new Error("สินค้าหมดแล้ว");
        }
        
        // 2. เช็กว่าลูกค้าจ่ายเงินมาพอไหม
        if(!this.isPayEnough(payment.getAmount())){
            throw new Error("เงินไม่พอ");
        }
        
        // เราทำการคำนวณ "ยอดเงินทอน" ไว้ก่อน เพื่อเอาไปเช็กในข้อ 3
        const change = this.calculateChange(payment.getAmount());

        // 3. เช็กว่าตู้มีเงินเพียงพอที่จะทอนไหม
        if(!this.isEnoughChange(change)){
            throw new Error("เงินทอนไม่พอ");
        }
        
        // ถ้าระบบผ่านการเช็กข้างต้นมาได้ แปลว่าซื้อได้ปกติ
        
        // นำค่าสินค้าเก็บเข้าตู้
        this.totalCash += this.price;
        // หักจำนวนสินค้าในตู้ออก 1 ชิ้น เพราะลูกค้าซื้อไปแล้ว
        this.Amount -= 1;

        // 4. ส่งมอบสินค้าและเงินทอน
        if(change > 0){
            return `ทอนเงิน ${change} บาท, กำลังส่งมอบสินค้า`
        }
        return `กำลังส่งมอบสินค้า`
    }
} 

// -------- ทดลองใช้งาน --------

// 1. สร้างตู้ขายของ (สินค้าราคา 10 บาท, มีของ 20 ชิ้น, ตู้มีเงินทอน 30 บาท)

const vendingMachine = new VenningMaching (10, 20, 30);

// 2. ลูกค้าเตรียมหยอดเงิน
const cashPayment = new Cashpayment();
cashPayment.addMoney(5);  // หยอด 5 บาท
cashPayment.addMoney(10); // หยอด 10 บาท

// 3. เอาเงินไปจ่ายตู้
const result = vendingMachine.pay(cashPayment);
console.log(result);

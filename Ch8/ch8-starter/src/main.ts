import "./css/table.css";
import "./css/style.css";
import { Customer, CustomerForm } from "./types/customer";
import { setupTable } from "./table";
import { validateCustomer } from "./validate";

function showMessage(message:string ,type:"success"|"error"){
  const messageElement = document.querySelector<HTMLDivElement>("#message")!
  messageElement.innerHTML = message
  messageElement.classList.remove("hide","success","error")
  messageElement.classList.add(type)
}

/**
 * ฟังก์ชันอเนกประสงค์สำหรับจัดการฟอร์มเพิ่มลูกค้า (Customer Form Setup)
 */
function setupForm(formElement: HTMLFormElement, customers: Customer[], callback: () => void) {
  /*
   * ขั้นตอนที่ 1: ดึง Input DOM Elements มารอไว้ก่อน 
   * การดึงมารอไว้ในตัวแปรจะทำให้ไม่ต้องไปค้นหา (querySelector) แบบซ้ำๆ ทุกครั้งที่มีการขยับฟอร์ม 
   * และทำให้โค้ดอ่านง่าย แถมลดภาระของโปรแกรมด้วยครับ!
   */
  const paymentTypeSelect = document.querySelector<HTMLSelectElement>("#paymentType")!
  const creditCardMetadata = document.querySelector<HTMLDivElement>("#creditCardMetadata")!
  const onlineBankingMetadata = document.querySelector<HTMLDivElement>("#onlineBankingMetadata")!

  /*
   * ขั้นตอนที่ 2: จัดการเหตุการณ์เมื่อผู้ใช้ "สลับ Dropdown วิธีชำระเงิน"
   */
  formElement.addEventListener("change", (event) => {
    // อ่านค่าว่าผู้ใช้สลับไปเลือกอะไร
    const target = event.target as HTMLInputElement
    
    // รีเซ็ตการซ่อนกล่องข้อมูลทั้งหมด โดยแอบซ่อน (add "hide") ให้หมดก่อน แล้วค่อยเปิดเฉพาะอันที่โดนเลือก
    if (target.value === "Cash") {
      creditCardMetadata.classList.add("hide")
      onlineBankingMetadata.classList.add("hide")
      
    } else if (target.value === "CreditCard") {
      creditCardMetadata.classList.remove("hide") // เลิกซ่อนบัตรเครดิต
      onlineBankingMetadata.classList.add("hide")
      
    } else if (target.value === "OnlineBanking") {
      creditCardMetadata.classList.add("hide")
      onlineBankingMetadata.classList.remove("hide") // เลิกซ่อนแอปธนาคาร
    }
  })

  /*
   * ขั้นตอนที่ 3: จัดการเหตุการณ์เมื่อผู้ใช้ "กดปุ่ม Submit" หน้าฟอร์ม
   */
  formElement.addEventListener("submit", (event) => {
    // สั่ง preventDefault() เพื่อป้องกันไม่ให้หน้าเว็บรีเฟรชเองเมื่อกด Submit (พฤติกรรมดั้งเดิมของ Form สมัยก่อน)
    event.preventDefault()

    // ใช้บล็อก try...catch เพื่อจับการเกิด Error ระหว่างตรวจสอบความถูกต้องของข้อมูลฟอร์ม
    try {
      /*
       * 3.1 สร้างก้อน Object ชื่อ customerForm ตามแม่พิมพ์ (Interface) ของ CustomerForm
       * โดยการดึงเอาข้อมูล .value ต่างๆ ที่อยู่ในช่องกรอก input ณ วินาทีนั้นมารวมกัน
       */
      const customerForm: CustomerForm = {
        name: document.querySelector<HTMLInputElement>("#customerName")!.value,
        isVerified: document.querySelector<HTMLInputElement>("#isVerified")!.checked,
        payments: {
          type: paymentTypeSelect.value, // นำค่ามาจากตัวแปรที่ดึงไว้แต่ต้นประหยัดแรง
          amount: document.querySelector<HTMLInputElement>("#amount")!.value,
          metadata: {
            cardNumber: document.querySelector<HTMLInputElement>("#cardNumber")!.value,
            cardHolderName: document.querySelector<HTMLInputElement>("#cardHolderName")!.value,
            accountNumber: document.querySelector<HTMLInputElement>("#accountNumber")!.value,
            bankName: document.querySelector<HTMLInputElement>("#bankName")!.value,
          }
        }
      }

      /* 
       * 3.2 ส่งข้อมูล customerForm ก้อนนี้ไปตรวจสอบ (Validate) ในฟังก์ชัน validateCustomer
       * ฟังก์ชันจะกรองข้อมูลขยะออก (เช่น undefined สำหรับรายการ Cash) ให้เหลือแค่ข้อมูลสำคัญจริงๆ
       */
      const validatedCustomer = validateCustomer(customerForm)
      
      // 3.3 เมื่อผ่านการตรวจเสร็จนำเพิ่มลงในตู้เก็บข้อมูลลูกค้า (Array: customers)
      customers.push(validatedCustomer)

      /*
       * 3.4 ** สำคัญ! โค้ดเก่าเรามีการเขียน setupTable() ซ้ำๆ ด้านใน แต่ฟังก์ชันนี้เราได้พกสิ่งที่เรียกว่า "callback" ท้ายพารามิเตอร์มาด้วยแล้ว!
       * แปลว่า "เมื่อเติมลูกค้าเสร็จ ให้ตะโกนเรียก (callback) บอกฝั่งนอกว่าเสร็จแล้วด้วยนะ ฝั่งนอกมาทำตารางให้ที"
       * นี่คือหัวใจว่าทำไมเราถึงใช้ callback เพื่อลดโค้ดที่ผูกมัดกันเกินไปครับ
       */
      callback()

      // 3.5 แจ้งให้กล่องข้อความโชว์ไฟเขียว บอกผู้ใช้ว่าบันทึกชัวร์ ๆ
      showMessage("User added successfully", "success")
      
      /* (ทริคพิเศษ: หากอยากให้กรอกเสร็จแล้วฟอร์มเคลียร์ตัวเอง สามารถเปิดคอมเมนต์นี้เพื่อใช้งานได้ครับ) */
      // formElement.reset()
      
    } catch (error: any) {
      /*
       * 3.6 ถ้ามีข้อผิดพลาดมาจากฟังก์ชัน validateCustomer หรือระหว่างทาง โค้ดจะมากระโดดจับ (catch) ตรงนี้ทันที!
       * ให้ดักจับ error ที่เกิดขึ้น โยนไปแสดงไฟแดงเตือนผู้ใช้ (อิงข้อความตอนพิมพ์ throw new Error() ด้านหลังบ้าน)
       */
      showMessage(error.message, "error")
    }
  })
}

export function setup(){
  const customers : Customer []= []
  customers.push({
    name:"John Doe",
    payments:{
      type:"cash",
      amount:100,
      metadata:undefined,
    },
    isVerified: true,
  })

  const tableElement = document.querySelector<HTMLTableElement>("#paymentTable")!

  const tableColumns =[
  "Customer Name",
  "Amount",
  "Payment Method",
  "Metadata",
  "Verified",
  ]
  
  setupTable(tableElement, tableColumns, customers);

  const formElement = document.querySelector<HTMLFormElement>("#addCustomerForm")!
  setupForm(formElement,customers,()=>setupTable(tableElement, tableColumns, customers));
}

setup();

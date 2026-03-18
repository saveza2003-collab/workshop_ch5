import { Customer } from "./types/customer";

/**
 * ฟังก์ชันสำหรับล้างข้อมูลในตารางและเริ่มปั้นโครงตารางใหม่ (Table Header)
 * สิ่งที่เจ๋งคือมันรับ columnsHeader เป็น Array ซึ่งแปลว่าเราจะวาดกี่คอลัมน์ก็ได้!
 */
export function setupTable(
    tableElement: HTMLTableElement,
    columnsHeader: string[],
    customers: Customer[]   
) {
    // ล้างข้อมูลตารางเก่าให้เกลี้ยงก่อนวาดใหม่ (ไม่งั้นข้อมูลซ้ำกันบานเลย)
    tableElement.innerHTML = "";
    
    // สร้าง Row แรกแทรกเข้าไปสำหรับทำเป็น "หัวร่อง" ของตาราง (<th>)
    const headerRow = tableElement.insertRow()
    
    // แปลงแต่ละชื่อคอลัมน์ให้อยู่ตรงกลางแท็ก <th>...</th> แล้วยัดกลับลงไปในแถว
    headerRow.innerHTML = columnsHeader.map(column => `<th>${column}</th>`).join("")

    // หลังจากวาดหัวตารางจบ ก็นำรายชื่อ Array ผู้ใช้งานที่รับมามาวนลูปทีละคนเพื่อ "เติมเนื้อหาตาราง" ผ่านฟังก์ชันด้านล่าง
    customers.forEach(customer => appendTableRow(tableElement, customer))
}

/**
 * ฟังก์ชันสำหรับต่อเติมแถวของผู้ใช้แต่ละคน (Table Data Row) ทีละบรรทัดๆ
 */
export function appendTableRow(tableElement: HTMLTableElement, customer: Customer) {
    // สั่งแทรกแถวใหม่สำหรับใส่ข้อมูลผู้ใช้
    const rowElement = tableElement.insertRow()
    
    // ใช้เทคนิค Destructuring: แกะตัวแปรออกมาจากก้อน (Object) ทำให้ไม่ต้องพิมพ์ customer.name ยาวๆ
    const { name, payments, isVerified } = customer
    
    // วาดเนื้อหาลงไปตามช่องแต่ละคอลัมน์ <td> ให้ตรงกับหัวร่องด้านบน
    rowElement.innerHTML = `
        <td>${name}</td>
        <td>${payments.amount}</td>
        <td>${payments.type}</td>
        <td>${payments.metadata ? JSON.stringify(payments.metadata) : "-"}</td>
        <td>${isVerified ? "✅" : "❌"}</td>
    `
}

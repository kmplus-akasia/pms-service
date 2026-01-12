import { Injectable } from '@nestjs/common';
import { MysqlService } from './infrastructure/database/mysql.service';
import * as fs from 'fs';
import { SuperiorEmployeePositionMasterRepository } from './modules/core/position/repositories/superior-employee-position-master.repository';

@Injectable()
export class AppService {
  constructor(private readonly mysqlService: MysqlService) {}
  async playground() {
    
  }


  async getEmployeeHierarchyDetailed() {
    const query = SuperiorEmployeePositionMasterRepository.query({
      queryFilter: '',
      additionalData: [],
    });
    const result = await this.mysqlService.query(query);

    // * Write json file
    const resultJson = result.map(row => {
      return {
        ...row,
        original_employee_number: row?.original_employee_number?.toString()?.trim() || null,
        superior_employee_number: row?.superior_employee_number?.toString()?.trim() || null,

      };
    });
    fs.writeFileSync('employee.json', JSON.stringify(resultJson, null, 2));

    await Promise.resolve(new Promise(resolve => setTimeout(resolve, 10000)));
    
    // * Get employee data from file employee.json
    const employeeJson = fs.readFileSync('employee.json', 'utf8');
    const employees = JSON.parse(employeeJson);

    // * Parse, now i need employee to subordinate
    const employeeDetailed : {
      [key: string]: {
        original_employee_number: string;
        superior_employee_number: string;
        colleagues: string[];
        subordinates: string[];
      }
    } = {};

    // * First pass: Initialize all employees with basic info
    employees.forEach((emp: any) => {
      employeeDetailed[emp.original_employee_number] = {
        original_employee_number: emp.original_employee_number,
        superior_employee_number: emp.superior_employee_number,
        colleagues: [],
        subordinates: []
      };
    });

    // * Second pass: Build colleagues and subordinates
    employees.forEach((emp: any) => {
      const currentEmp = employeeDetailed[emp.original_employee_number];

      // Find colleagues: employees who have the same superior but are not the current employee
      // Only consider employees who actually have a superior (not null)
      currentEmp.colleagues = emp.superior_employee_number ? employees
        .filter((otherEmp: any) =>
          otherEmp.superior_employee_number === emp.superior_employee_number &&
          otherEmp.original_employee_number !== emp.original_employee_number
        )
        .map((otherEmp: any) => otherEmp.original_employee_number) : [];

      // Find subordinates: employees whose superior is the current employee
      currentEmp.subordinates = employees
        .filter((otherEmp: any) =>
          otherEmp.superior_employee_number === emp.original_employee_number
        )
        .map((otherEmp: any) => otherEmp.original_employee_number);
    });

    // * Optional: Write to CSV or log the result
    console.log('Employee detailed structure built successfully');
    console.log('Sample employee:', employeeDetailed[employees[0].original_employee_number]);

    // * Write to file using streaming to handle large data
    console.log('Writing Employee detailed json');

    // Convert to array format for JSON
    const employeeDetailedArray = Object.values(employeeDetailed);

    // Write in chunks to avoid memory issues
    const chunkSize = 1000;
    const jsonChunks: string[] = [];
    jsonChunks.push('[');

    for (let i = 0; i < employeeDetailedArray.length; i += chunkSize) {
      const chunk = employeeDetailedArray.slice(i, i + chunkSize);
      const chunkJson = chunk.map(emp => JSON.stringify(emp, null, 2)).join(',\n');
      jsonChunks.push(chunkJson);

      if (i + chunkSize < employeeDetailedArray.length) {
        jsonChunks.push(',');
      }

      console.log(`Processed ${Math.min(i + chunkSize, employeeDetailedArray.length)}/${employeeDetailedArray.length} employees`);
    }

    jsonChunks.push(']');

    // Write the complete JSON
    fs.writeFileSync('employee-detailed.json', jsonChunks.join('\n'));

    return {
      message: 'Employee detailed structure built successfully',
      totalEmployees: Object.keys(employeeDetailed).length,
      sampleEmployee: employeeDetailed[employees[0].original_employee_number]
    };
  }
}

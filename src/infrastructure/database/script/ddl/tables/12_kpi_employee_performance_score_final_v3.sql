CREATE TABLE IF NOT EXISTS kpi_employee_performance_score_final_v3 (
  kpi_employee_performance_score_final_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  employee_number VARCHAR(50) NOT NULL,

  performance_score_final FLOAT,
  performance_score_base FLOAT,
  addition_score FLOAT,
  boundary_score FLOAT,

  quarter INT,
  year INT,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,

  CONSTRAINT fk_emp_perf_employee
    FOREIGN KEY (employee_number) REFERENCES tb_employee(employee_number),

  INDEX idx_emp_perf_employee (employee_number),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

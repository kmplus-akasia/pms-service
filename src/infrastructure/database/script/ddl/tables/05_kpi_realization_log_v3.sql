CREATE TABLE IF NOT EXISTS kpi_realization_log_v3 (
  kpi_realization_log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  kpi_realization_id BIGINT NOT NULL,
  log_notes TEXT,

  kpi_id BIGINT NOT NULL,

  employee_number VARCHAR(50),
  notes TEXT,

  realization FLOAT,
  file_id BIGINT,

  source ENUM('SYSTEM','MIGRATION') DEFAULT 'SYSTEM',
  submission_status ENUM('NOT_SUBMITTED','SUBMITTED'),
  approval_status ENUM(
    'DRAFT','WAITING_FOR_APPROVAL','REJECTED','APPROVED'
  ),

  approver_employee_number VARCHAR(50),
  approver_employee_text TEXT,
  approval_notes TEXT,

  submit_date DATE,
  generated_date DATE,

  day INT,
  week INT,
  month INT,
  year INT,

  is_concluded BOOLEAN DEFAULT FALSE,
  version INT NOT NULL,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,

  CONSTRAINT fk_kpi_realization_log
    FOREIGN KEY (kpi_realization_id) REFERENCES kpi_realization_v3(kpi_realization_id),

  CONSTRAINT fk_kpi_realization_log_kpi
    FOREIGN KEY (kpi_id) REFERENCES kpi_v3(kpi_id),

  CONSTRAINT fk_kpi_realization_log_employee
    FOREIGN KEY (employee_number) REFERENCES tb_employee(employee_number),

  CONSTRAINT fk_kpi_realization_log_approver
    FOREIGN KEY (approver_employee_number) REFERENCES tb_employee(employee_number),
  
  CONSTRAINT fk_kpi_realization_log_file
    FOREIGN KEY (file_id) REFERENCES file(file_id),

  INDEX idx_kpi_realization_log_employee (employee_number),
  INDEX idx_kpi_realization_log_approver (approver_employee_number),
  INDEX idx_kpi_realization_log_kpi (kpi_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

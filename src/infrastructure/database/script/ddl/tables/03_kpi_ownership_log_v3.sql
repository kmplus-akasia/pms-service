CREATE TABLE IF NOT EXISTS kpi_ownership_log_v3 (
  kpi_ownership_log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  kpi_ownership_id BIGINT NOT NULL,
  log_notes TEXT,

  kpi_id BIGINT NOT NULL,

  employee_number VARCHAR(50),
  position_master_variant_id INT,

  ownership_type ENUM('OWNER','SHARED_OWNER','COLLABORATOR') NOT NULL,
  weight FLOAT,

  weight_approval_status ENUM(
    'DRAFT','WAITING_FOR_APPROVAL','REJECTED','READY','APPROVED'
  ),
  weight_approver_employee_number VARCHAR(50),
  weight_approver_text TEXT,
  weight_approval_notes TEXT,

  last_realization FLOAT,
  start_date DATE,
  end_date DATE,
  year INT,

  version INT NOT NULL,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,

  CONSTRAINT fk_kpi_ownership_log
    FOREIGN KEY (kpi_ownership_id) REFERENCES kpi_ownership_v3(kpi_ownership_id),

  CONSTRAINT fk_kpi_ownership_log_kpi
    FOREIGN KEY (kpi_id) REFERENCES kpi_v3(kpi_id),

  CONSTRAINT fk_kpi_ownership_log_employee
    FOREIGN KEY (employee_number) REFERENCES tb_employee(employee_number),

  CONSTRAINT fk_kpi_ownership_log_position_master_variant
    FOREIGN KEY (position_master_variant_id) REFERENCES tb_position_master_variant(position_master_variant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

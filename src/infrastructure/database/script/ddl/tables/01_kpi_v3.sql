CREATE TABLE IF NOT EXISTS kpi_v3 (
  kpi_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  parent_kpi_id BIGINT,

  type ENUM('IMPACT','OUTPUT','KAI') NOT NULL,
  nature_of_work ENUM('STATIC','PROGRESSING'),
  cascading_method ENUM('DIRECT','INDIRECT'),
  formula TEXT,

  target FLOAT,
  target_unit VARCHAR(25),

  perspective VARCHAR(25),
  polarity ENUM('NEUTRAL','POSITIVE','NEGATIVE'),

  monitoring_period ENUM('DAILY','WEEKLY','MONTHLY','QUARTERLY') NOT NULL,
  kpi_ownership_type ENUM('SPECIFIC','SHARED','COMMON'),

  kpi_for_group_id BIGINT,
  source ENUM('SYSTEM','MIGRATION') DEFAULT 'SYSTEM',

  item_approval_status ENUM(
    'DRAFT','WAITING_FOR_APPROVAL','REJECTED','READY','APPROVED'
  ),
  item_approver_employee_number VARCHAR(50),
  item_approver_text TEXT,
  item_approver_notes TEXT,

  kpi_dictionary_id BIGINT,

  created_by_employee_number VARCHAR(50),
  created_by_text TEXT,

  is_active TINYINT(1) NOT NULL DEFAULT 1,
  title TEXT,
  description TEXT,
  reference_requirement TEXT,

  function_mapping TEXT,
  cohort_mapping INT,

  version INT NOT NULL,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,

  CONSTRAINT fk_kpi_parent
    FOREIGN KEY (parent_kpi_id)
    REFERENCES kpi_v3(kpi_id),

  CONSTRAINT fk_kpi_item_approver
    FOREIGN KEY (item_approver_employee_number)
    REFERENCES tb_employee(employee_number),

  CONSTRAINT fk_kpi_created_by
    FOREIGN KEY (created_by_employee_number)
    REFERENCES tb_employee(employee_number),

  INDEX idx_kpi_parent (parent_kpi_id),
  INDEX idx_kpi_created_by (created_by_employee_number),
  INDEX idx_kpi_item_approver (item_approver_employee_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS kpi_score_v3 (
  kpi_score_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  kpi_id BIGINT NOT NULL,
  employee_number VARCHAR(50) NOT NULL,

  realization FLOAT,
  target FLOAT,
  polarity ENUM('NEUTRAL','POSITIVE','NEGATIVE'),

  score FLOAT,
  weight FLOAT,
  weighted_score FLOAT,

  month INT,
  year INT,
  conclusion_date DATE,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,

  CONSTRAINT fk_kpi_score_kpi
    FOREIGN KEY (kpi_id) REFERENCES kpi_v3(kpi_id),

  CONSTRAINT fk_kpi_score_employee
    FOREIGN KEY (employee_number) REFERENCES tb_employee(employee_number),

  INDEX idx_kpi_score_employee (employee_number),
  INDEX idx_kpi_score_kpi (kpi_id),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

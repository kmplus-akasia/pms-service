CREATE TABLE IF NOT EXISTS kpi_employee_performance_score_v3 (
  kpi_employee_performance_score_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  employee_number VARCHAR(50) NOT NULL,

  final_score FLOAT,
  kpi_score FLOAT,
  output_score FLOAT,
  impact_score FLOAT,
  boundary_score FLOAT,

  kpi_score_weight FLOAT,
  output_score_weight FLOAT,
  impact_score_weight FLOAT,

  cohort_kpi_formula_id BIGINT,

  kpi_kpi_ids TEXT,
  output_kpi_ids TEXT,
  impact_kpi_ids TEXT,

  month INT,
  year INT,
  aggregation_date DATE,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,

  CONSTRAINT fk_perf_cohort_formula
    FOREIGN KEY (cohort_kpi_formula_id)
    REFERENCES cohort_kpi_formula(cohort_kpi_formula_id),

  CONSTRAINT fk_perf_employee
    FOREIGN KEY (employee_number) REFERENCES tb_employee(employee_number),

  INDEX idx_perf_employee (employee_number),
  INDEX idx_perf_cohort_formula (cohort_kpi_formula_id),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

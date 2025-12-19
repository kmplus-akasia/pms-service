CREATE TABLE IF NOT EXISTS cohort_kpi_formula_log (
  cohort_kpi_formula_log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  cohort_kpi_formula_id BIGINT NOT NULL,
  log_notes TEXT,

  cohort_id BIGINT NOT NULL,

  kpi_score_weight FLOAT,
  output_score_weight FLOAT,
  impact_score_weight FLOAT,

  version INT NOT NULL,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,

  CONSTRAINT fk_cohort_formula_log
    FOREIGN KEY (cohort_kpi_formula_id) REFERENCES cohort_kpi_formula(cohort_kpi_formula_id),

  CONSTRAINT fk_cohort_formula_log_cohort
    FOREIGN KEY (cohort_id) REFERENCES position_cohort(cohort_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS kpi_position_performance_score_v3 (
  kpi_position_performance_score_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  position_master_variant_id BIGINT NOT NULL,

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

  CONSTRAINT fk_pos_perf_cohort_formula
    FOREIGN KEY (cohort_kpi_formula_id)
    REFERENCES cohort_kpi_formula(cohort_kpi_formula_id),

  CONSTRAINT fk_pos_perf_position_master_variant
    FOREIGN KEY (position_master_variant_id) REFERENCES tb_position_master_variant(position_master_variant_id),

  INDEX idx_pos_perf_position_master_variant (position_master_variant_id),
  INDEX idx_pos_perf_cohort_formula (cohort_kpi_formula_id),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

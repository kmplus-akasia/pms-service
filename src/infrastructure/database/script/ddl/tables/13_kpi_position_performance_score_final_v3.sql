CREATE TABLE IF NOT EXISTS kpi_position_performance_score_final_v3 (
  kpi_position_performance_score_final_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  position_master_variant_id INT NOT NULL,

  performance_score_final FLOAT,
  performance_score_base FLOAT,
  addition_score FLOAT,
  boundary_score FLOAT,

  quarter INT,
  year INT,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,

  CONSTRAINT fk_pos_perf_position_final_variant
    FOREIGN KEY (position_master_variant_id) REFERENCES tb_position_master_variant(position_master_variant_id),

  INDEX idx_pos_perf_position_final_variant (position_master_variant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

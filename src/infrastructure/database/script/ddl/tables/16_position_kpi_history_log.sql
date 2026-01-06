CREATE TABLE IF NOT EXISTS position_kpi_history_log (
  log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  position_variant_id INT NOT NULL,
  period VARCHAR(50) NOT NULL,

  event_type ENUM(
    'ITEM_ADDED',
    'ITEM_REMOVED',
    'WEIGHT_ADJUSTED',
    'QUARTERLY_SCORE_FINALIZED'
  ) NOT NULL,

  summary_text TEXT NOT NULL,
  actor_employee_number VARCHAR(50),
  payload JSON,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_position_kpi_log_position_variant
    FOREIGN KEY (position_variant_id)
    REFERENCES tb_position_master_variant(position_master_variant_id),

  CONSTRAINT fk_position_kpi_log_actor
    FOREIGN KEY (actor_employee_number)
    REFERENCES tb_employee(employee_number),

  INDEX idx_position_kpi_log_position (position_variant_id),
  INDEX idx_position_kpi_log_period (period),
  INDEX idx_position_kpi_log_actor (actor_employee_number),
  INDEX idx_position_kpi_log_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS portfolio_change_item (
  change_item_id VARCHAR(100) PRIMARY KEY,
  request_id VARCHAR(100) NOT NULL,
  kpi_id BIGINT,

  change_type ENUM(
    'ADD',
    'REMOVE',
    'UPDATE_WEIGHT',
    'UPDATE_TARGET'
  ) NOT NULL,

  kpi_type ENUM('OUTPUT','KAI') NOT NULL,

  before_snapshot JSON,
  after_snapshot JSON,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_portfolio_change_item_request
    FOREIGN KEY (request_id)
    REFERENCES portfolio_change_request(request_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_portfolio_change_item_kpi
    FOREIGN KEY (kpi_id)
    REFERENCES kpi_v3(kpi_id),

  INDEX idx_portfolio_change_item_request (request_id),
  INDEX idx_portfolio_change_item_kpi (kpi_id),
  INDEX idx_portfolio_change_item_type (change_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


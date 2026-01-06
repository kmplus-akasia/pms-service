CREATE TABLE IF NOT EXISTS portfolio_change_request (
  request_id VARCHAR(100) PRIMARY KEY,
  position_variant_id INT NOT NULL,
  period VARCHAR(50) NOT NULL,

  trigger_type ENUM(
    'WEIGHT_ADJUSTMENT',
    'NEW_ITEM_FROM_PKPI_CASCADE',
    'DELETION_AFTER_REALLOCATION'
  ) NOT NULL,

  status ENUM(
    'DRAFT',
    'SUBMITTED',
    'IN_REVIEW',
    'APPROVED',
    'REJECTED',
    'REVISION_REQUESTED'
  ) NOT NULL DEFAULT 'DRAFT',

  requester_employee_number VARCHAR(50) NOT NULL,
  approver_employee_numbers JSON,
  notes TEXT,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_portfolio_change_position_variant
    FOREIGN KEY (position_variant_id)
    REFERENCES tb_position_master_variant(position_master_variant_id),

  CONSTRAINT fk_portfolio_change_requester
    FOREIGN KEY (requester_employee_number)
    REFERENCES tb_employee(employee_number),

  INDEX idx_portfolio_change_position (position_variant_id),
  INDEX idx_portfolio_change_period (period),
  INDEX idx_portfolio_change_status (status),
  INDEX idx_portfolio_change_requester (requester_employee_number),
  INDEX idx_portfolio_change_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


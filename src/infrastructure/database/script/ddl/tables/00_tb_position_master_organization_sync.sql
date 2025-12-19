-- defaultdb.tb_position_master_organization_sync definition

CREATE TABLE IF NOT EXISTS tb_position_master_organization_sync (
  position_master_organization_sync_id int NOT NULL AUTO_INCREMENT,
  position_master_id int NOT NULL,
  organization_master_id int NOT NULL,
  start_date datetime NOT NULL,
  end_date datetime DEFAULT NULL,
  created_by int DEFAULT NULL,
  last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_updated_by int DEFAULT NULL,
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt timestamp NULL DEFAULT NULL,
  PRIMARY KEY (position_master_organization_sync_id),
  KEY tb_position_master_organization_sync_FK (position_master_id) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

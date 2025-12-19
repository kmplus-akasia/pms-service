-- defaultdb.tb_position_master_variant definition

CREATE TABLE IF NOT EXISTS tb_position_master_variant (
  position_master_variant_id int NOT NULL AUTO_INCREMENT,
  position_master_id int NOT NULL,
  variant int DEFAULT NULL,
  created_by int DEFAULT NULL,
  last_updated_at timestamp NULL DEFAULT NULL,
  last_updated_by int DEFAULT NULL,
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt timestamp NULL DEFAULT NULL,
  is_job_assignment tinyint DEFAULT '0',
  PRIMARY KEY (position_master_variant_id)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

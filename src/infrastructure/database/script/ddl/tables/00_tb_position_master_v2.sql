-- defaultdb.tb_position_master_v2 definition

CREATE TABLE IF NOT EXISTS tb_position_master_v2 (
  position_master_id int NOT NULL AUTO_INCREMENT,
  name varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  job_class_level int DEFAULT NULL,
  job_score int DEFAULT NULL,
  total_position_max int DEFAULT NULL,
  work_unit text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  created_by int DEFAULT NULL,
  start_date datetime DEFAULT NULL,
  end_date datetime DEFAULT NULL,
  last_updated_at timestamp NULL DEFAULT NULL,
  last_updated_by int DEFAULT NULL,
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt timestamp NULL DEFAULT NULL,
  position_master_type_id int unsigned DEFAULT NULL,
  position_master_urgency_id int unsigned DEFAULT NULL,
  is_job_assignment tinyint DEFAULT '0',
  is_career_path tinyint DEFAULT '1',
  PRIMARY KEY (position_master_id)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

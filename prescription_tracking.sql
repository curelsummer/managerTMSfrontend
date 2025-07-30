-- 处方跟踪表
CREATE TABLE `prescription_tracking` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '跟踪ID（主键）',
  `patient_id` BIGINT NOT NULL COMMENT '患者ID',
  `prescription_id` BIGINT NOT NULL COMMENT '处方ID',
  `executor_id` BIGINT NOT NULL COMMENT '执行人ID',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-草稿/1-已下发/2-执行中/3-完成/4-异常',
  `progress` VARCHAR(64) DEFAULT NULL COMMENT '进度描述',
  `exception` VARCHAR(128) DEFAULT NULL COMMENT '异常原因（仅当status=4时必填）',
  `created_by` BIGINT NOT NULL COMMENT '创建人ID（系统用户ID）',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT NOT NULL COMMENT '最近操作人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最近操作时间（自动更新）',
  PRIMARY KEY (`id`),
  KEY `idx_patient_id` (`patient_id`),
  KEY `idx_prescription_id` (`prescription_id`),
  KEY `idx_executor_id` (`executor_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_updated_at` (`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='处方跟踪表'; 
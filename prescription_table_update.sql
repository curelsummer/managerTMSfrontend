-- 更新处方表，添加设备相关字段
ALTER TABLE `prescription` 
ADD COLUMN `device_id` BIGINT NULL COMMENT '设备ID' AFTER `presPartName`,
ADD COLUMN `device_code` VARCHAR(100) NULL COMMENT '设备唯一码' AFTER `device_id`,
ADD INDEX `idx_device_id` (`device_id`),
ADD INDEX `idx_device_code` (`device_code`);

-- 更新现有记录的设备字段为NULL
UPDATE `prescription` SET `device_id` = NULL, `device_code` = NULL WHERE `device_id` IS NULL; 
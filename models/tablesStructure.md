# Processes
mysql> DESCRIBE Processes
    -> ;
+----------------+--------------+------+-----+-------------------+-------------------+
| Field          | Type         | Null | Key | Default           | Extra             |
+----------------+--------------+------+-----+-------------------+-------------------+
| ProcessID      | varchar(36)  | NO   |     | NULL              |                   |
| DeviceID       | varchar(36)  | YES  | MUL | NULL              |                   |
| ProcessName    | varchar(255) | NO   |     | NULL              |                   |
| ProcessCommand | text         | YES  |     | NULL              |                   |
| CPUPercentage  | decimal(5,2) | YES  |     | NULL              |                   |
| Timestamp      | datetime     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| TenantID       | varchar(36)  | YES  |     | NULL              |                   |
| ID             | int          | NO   | PRI | NULL              | auto_increment    |
+----------------+--------------+------+-----+-------------------+-------------------+
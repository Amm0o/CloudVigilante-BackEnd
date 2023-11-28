import { Pool, RowDataPacket } from "mysql2/promise";


export async function performanceTelemetry(telemetry: Object, connectionPool: Pool) {
    

    // Get relevant data from the telemetry object

    for (const process of Object.values(telemetry)) {
        const deviceID = process.DeviceID;
        const ProcessPID = process.ProcessPID;
        const TenantID = process.TenantID;
        const ProcessName = process.ProcessName;
        const ProcessCommand = process.ProcessCommand;

        // Need extra checking due to weird values coming from client
        let ProcessCpuUsage;
        if(isNaN(parseFloat(process.ProcessCpuUsage)) || process.ProcessCpuUsage.trim().toLowerCase() === 'unknown') {
            process.ProcessCpuUsage = 0;
        } else {
            ProcessCpuUsage = parseFloat(process.ProcessCpuUsage);
        }

        const insertQuery = "INSERT INTO Processes (ProcessID, DeviceID, ProcessName, ProcessCommand, CPUPercentage, TenantID) VALUES (?, ?, ?, ?, ?, ?)"
        const values = [ProcessPID.trim(), deviceID.trim(), ProcessName.trim(), ProcessCommand.trim(), ProcessCpuUsage, TenantID.trim()];

        try {
            await connectionPool.query(insertQuery, values);
        } catch (error) {
            console.error('Database operation failed, could not insert performance telemetry:', error);
            // Handle the error appropriately
        }
    }

}
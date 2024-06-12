import { Pool, RowDataPacket } from "mysql2/promise";


export async function registerDevice(data: Object, connectionPool: Pool) {


    // console.log(typeof (data as { DeviceID: string }[])[0]);
    const deviceID = (data as { DeviceID: string }[])[0].DeviceID;
    const tenantID = (data as { TenantID: string }[])[0].TenantID;
    const deviceName = (data as { DeviceName: string }[])[0].DeviceName;

    // Logic to test if the device is registered if not adding it
    try {
        // Query the database for the deviceID
        const [rows]: [RowDataPacket[]] = await connectionPool.query(
            "SELECT 1 FROM Devices WHERE DeviceID = ? LIMIT 1",
            [deviceID.trim()]
        );

        if (rows.length === 0) {
            // DeviceID does not exist in the database, insert new record
            const insertQuery = "INSERT INTO Devices (DeviceID, TenantID, DeviceName, DeviceDescription) VALUES (?, ?, ?, ?)";
            const values = [deviceID.trim(), tenantID.trim(), deviceName.trim(), "No description available"];
            await connectionPool.query(insertQuery, values);

            console.log("Device registered successfully!");
        }

        console.log("Device already registered!");

    } catch (error) {
        console.error('Database operation failed:', error);
        // Handle the error appropriately
    }
}
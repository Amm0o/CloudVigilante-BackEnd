import { Pool } from "mysql2/promise";


export async function getPerformanceTelemtry(connectionPool: any, timeFrameInt: number) {
    // Get the top 10 processes by average CPU usage
    const [topProcesses] = await connectionPool.query(`
    SELECT 
        ProcessName, 
        ProcessID, 
        AVG(CPUPercentage) AS AvgCPUPercentage
    FROM 
        Processes
    WHERE 
        Timestamp > NOW() - INTERVAL ? MINUTE
    GROUP BY 
        ProcessName, 
        ProcessID
    ORDER BY 
        AvgCPUPercentage DESC 
    LIMIT 10
    `, [timeFrameInt]);

    // Check if topProcesses has any records to avoid syntax error in the next query
    if (topProcesses.length === 0) {
        throw new Error('No top processes found.');
    }

    // Create a list of parameters for the IN clause based on the topProcesses
    const parameters: any = [];
    topProcesses.forEach(process => {
    parameters.push(process.ProcessName, process.ProcessID);
    });

    // Create a placeholders string for the parameterized query
    const placeholders = topProcesses.map(() => '(?, ?)').join(',');

    // Now get the details of the top 10 processes
    const [processDetails] = await connectionPool.query(`
    SELECT 
        ProcessName, 
        ProcessID,
        CPUPercentage,
        DATE_FORMAT(Timestamp, '%Y-%m-%d %H:%i:00') AS RoundedTimestamp
    FROM 
        Processes
    WHERE 
        (ProcessName, ProcessID) IN (${placeholders})
        AND Timestamp > NOW() - INTERVAL ? MINUTE
    ORDER BY 
        ProcessName, 
        ProcessID, 
        Timestamp ASC
    `, [...parameters, timeFrameInt]);

    return processDetails;

}

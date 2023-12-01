import { Pool } from "mysql2/promise";

export async function sendPerformanceTelemetry (req: Request, connectionPool: Pool): Promise<Response> {

    // Set CORS headers
    const headers = new Headers({
        "Content-Type": "application/json", // Set Content-Type
        "Access-Control-Allow-Origin": "*", // Allow any origin
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Allowed methods
        "Access-Control-Allow-Headers": "Content-Type, Authorization" // Allowed headers
    });


    if (req.method !== "GET") {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        // Get data from db:
        // Create a query to get data from table processes 
        const [rows] = await connectionPool.query("SELECT * FROM Processes WHERE Timestamp > NOW() - INTERVAL 1 SECOND");
        return new Response(JSON.stringify(rows), { status: 200, headers: headers });


    } catch (error) { 
        console.error("Database operation failed:", error);
        return new Response("Internal Server Error", { status: 500 });
    }

}


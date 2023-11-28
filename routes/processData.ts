import { Pool } from "mysql2/promise";
import { registerDevice } from "../lib/dbHelpers/deviceResgistration.ts";
import { performanceTelemetry } from "../lib/dbHelpers/performanceTelemetry.ts";

export async function processDataRoute (req: Request, connectionPool: Pool) {
    if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 405 })
    }

    try {
        // Get and Parse the request body
        const body = await req.text();
        const data = JSON.parse(body); // Json blob containing the data from client

        // console.log("Data received from client: ", data);
        console.log("Received data, thanks! ");
        
        // Check if the device is registered
        // If not, register it
        registerDevice(data, connectionPool);



        // Send data to the database
        performanceTelemetry(data, connectionPool);
        console.log("Performance telemetry inserted successfully!");



        // Send response back
        return new Response("Data received and processed", { status: 200 });
    } catch (error) {
        // Handle parsing errors
        return new Response("Invalid JSON data", { status: 400 });
    }

    
}
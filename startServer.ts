import { processDataRoute } from "./routes/processData";
import {connect} from "./models/dbConnector";
import { Pool } from "mysql2/promise";
import {sendPerformanceTelemetry} from "./routes/sendRealTimePerformance";


export async function startServer() {
    let dbConnection: Pool;
    
    try {
        dbConnection = await connect(); // Connect to the database
        console.log("Database connection successfully!");
    } catch (error) {
        console.error("Database connection failed!: ", error);
        throw error;
    }

    const server = Bun.serve({
        fetch(req: Request) {

            // Set CORS headers
            const headers = new Headers({
                "Access-Control-Allow-Origin": "*", // Allow any origin
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Allowed methods
                "Access-Control-Allow-Headers": "Content-Type, Authorization" // Allowed headers
            });
    
            // Get URL PATH
            const url = new URL(req.url);
            const urlPath = url.pathname;
    
            // Handle preflight requests for CORS
            if (req.method === "OPTIONS") {
                return new Response(null, { headers });
            }


            // Check if it's a POST request to the specific endpoint
            if (req.method === "POST") {
    
              // Check API endpoint
              if (urlPath === "/api/dev/v1/processInfo") { // Process Data
                return processDataRoute(req, dbConnection);
              } else {
                return new Response("Not Found", { status: 404 });
              }
                
            } 
            
            // GET Routes
            if (req.method === "GET") { 
              // Real Time Performance sender
              if (urlPath === "/api/dev/v1/realtime-performance") {
                console.log("Real Time Performance Requested");
                return sendPerformanceTelemetry(req, dbConnection);
              } else {
                return new Response("Not Found", { status: 404 });
              }
            }
            
        },
        tls: {
          key: Bun.file("/home/angelo/projects/CloudVigilante/certs/key.pem"),
          cert: Bun.file("/home/angelo/projects/CloudVigilante/certs/cert.pem"),
        },
        port: 8080
        
    });
    

    console.log(`Server running on ${server.hostname}:${server.port}...`);
}









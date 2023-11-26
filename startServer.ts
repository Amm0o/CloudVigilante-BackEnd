import { processDataRoute } from "./routes/processData";
import {connect} from "./models/dbConnector";


export async function startServer() {
    let dbConnection;
    
    try {
        dbConnection = await connect(); // Connect to the database
        console.log("Database connection successfully!");
    } catch (error) {
        console.error("Database connection failed!: ", error);
        throw error;
    }

    const server = Bun.serve({
        fetch(req: Request) {
    
            // Get URL PATH
            const url = new URL(req.url);
            const urlPath = url.pathname;
    
            // Check if it's a POST request to the specific endpoint
            if (req.method === "POST") {
    
              // Check API endpoint
              if (urlPath === "/api/dev/v1/processInfo") { // Process Data
                return processDataRoute(req, dbConnection);
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







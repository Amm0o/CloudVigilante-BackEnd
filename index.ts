import { processDataRoute } from "./routes/processData";

const server = Bun.serve({
    fetch(req: Request) {

        // Get URL PATH
        const url = new URL(req.url);
        const urlPath = url.pathname;

        // Check if it's a POST request to the specific endpoint
        if (req.method === "POST") {

          // Check API endpoint
          if (urlPath === "/api/dev/v1/processInfo") {
            return processDataRoute(req);
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

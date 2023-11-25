export async function processDataRoute (req: Request) {
    if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 405 })
    }

    try {
        // Get and Parse the request body

        const body = await req.text();
        const data = JSON.parse(body);
        console.log("Received data, thanks! ");

        // Send data to the database

        // Send response back
        return new Response("Data received and processed", { status: 200 });
    } catch (error) {
        // Handle parsing errors
        return new Response("Invalid JSON data", { status: 400 });
    }

    
}
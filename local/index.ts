import {McpServer} from "@modelcontextprotocol/server";
import {serveStdio} from "@modelcontextprotocol/server/stdio";
import {z} from "zod";


function createServer() {
    const server = new McpServer({
        name : "mcp-server-local",
        version : "1.0.0",
    });

    server.registerTool(
        "get_logs", 

        {
            description: "Get the logs for a specific service",
            inputSchema: {
                service: z.string().describe("The name of the service to get logs for"),
                lines: z.number().optional().default(100).describe("The number of lines to return"),
            },
            outputSchema: z.object({
                logs: z.string().describe("The logs for the specified service"),
            }),
        }, 

        async ({service, lines}) => {
            // For demonstration purposes, we'll just return mock log lines.
            const mockLogs = ("[INFO] Service " + service + " started successfully.\n" +
                "[INFO] Service " + service + " is running.\n" +
                "[INFO] Service " + service + " stopped successfully.\n")
                .repeat(Math.max(1, Math.ceil(lines / 3)))
                .split("\n")
                .slice(0, lines)
                .join("\n");
            return {
                content: [{type: "text", text: mockLogs}],
                structuredContent: {logs: mockLogs},
            };
        }
    );

    return server;
}

serveStdio(() => createServer());

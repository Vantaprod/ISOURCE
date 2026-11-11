import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DiagnosticPage() {
  let dbStatus = "Unknown";
  let errorDetails = "";

  try {
    // Try to query the database
    const count = await prisma.product.count();
    dbStatus = `SUCCESS! Connected to DB. Total products: ${count}`;
  } catch (error: any) {
    dbStatus = "FAILED to connect to DB";
    errorDetails = error.message;
  }

  return (
    <div className="p-10 font-sans max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Isource Diagnostic Mode</h1>
      
      <div className="p-4 bg-surface border border-border rounded mb-4">
        <h2 className="font-bold text-lg mb-2">Database Test</h2>
        <p className={`font-mono ${dbStatus.includes("SUCCESS") ? "text-green-600" : "text-red-600"}`}>
          {dbStatus}
        </p>
        {errorDetails && (
          <pre className="mt-2 p-2 bg-red-100 text-red-800 text-xs overflow-auto">
            {errorDetails}
          </pre>
        )}
      </div>

      <div className="p-4 bg-surface border border-border rounded">
        <h2 className="font-bold text-lg mb-2">Environment Check</h2>
        <p>Node Env: <code>{process.env.NODE_ENV}</code></p>
        <p>DATABASE_URL set: <code>{process.env.DATABASE_URL ? "YES" : "NO"}</code></p>
      </div>
    </div>
  );
}
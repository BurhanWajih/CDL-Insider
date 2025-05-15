import mysql from "mysql2/promise"

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cdl_stats",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Create a connection pool
const pool = mysql.createPool(dbConfig)

// Helper function to execute SQL queries
export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
  try {
    // Convert numeric parameters to ensure proper type handling
    const processedParams = params.map((param) => {
      if (typeof param === "number") {
        return param.toString()
      }
      return param
    })

    const [results] = await pool.execute(query, processedParams)
    return results as T
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Test database connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log("Database connection successful")
    connection.release()
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

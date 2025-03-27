interface HealthCheckResponse {
  status: string;
  message: string;
  uptime: number;
  timestamp: number;
  environment: string;
  mongodbConnected: boolean;
  apiVersion: string;
  serverTime: string;
}

const apiUrl = process.env.REACT_APP_API_URL;

export async function checkHealth(): Promise<HealthCheckResponse> {
  try {
    const response = await fetch(`${apiUrl}/admin/healthcheck`);
    if (!response.ok) {
      throw new Error(`Health check failed with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
} 
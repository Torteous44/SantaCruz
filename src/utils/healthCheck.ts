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
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000; // 2 seconds

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function checkHealth(retryCount = 0): Promise<HealthCheckResponse> {
  try {
    const response = await fetch(`${apiUrl}/admin/healthcheck`);
    if (!response.ok) {
      throw new Error(`Health check failed with status: ${response.status}`);
    }
    return await response.json();
  } catch (error: unknown) {
    
    if (retryCount < MAX_RETRIES) {
      await delay(RETRY_DELAY_MS);
      return checkHealth(retryCount + 1);
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Health check failed after ${MAX_RETRIES} attempts: ${errorMessage}`);
  }
} 
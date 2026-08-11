export interface VisualTest {
  id: string;
  category: string;
  name: string;
  description: string;
  path: string;
  icon: any;
  features: string[];
}

export interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
  duration?: number;
}

export interface ApiTestCategory {
  name: string;
  icon: any;
  tests: ApiTest[];
}

export interface ApiTest {
  name: string;
  endpoint: string;
  method: string;
}

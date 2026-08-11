import api from '../../../../services/api';
import type { TestResult, ApiTest } from '../../types/tests/tests.types';

export const runSingleTest = async (test: ApiTest): Promise<TestResult> => {
  const startTime = Date.now();
  try {
    const response = await api.get(test.endpoint);
    const duration = Date.now() - startTime;
    return {
      name: test.name,
      status: 'success' as const,
      message: `Status: ${response.status}`,
      duration
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    return {
      name: test.name,
      status: 'error' as const,
      message: error.response?.data?.message || error.message,
      duration
    };
  }
};

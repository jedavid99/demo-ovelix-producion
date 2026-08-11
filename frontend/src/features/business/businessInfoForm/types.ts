import type { BusinessInfo, BusinessInfoUpdate } from '@/types/businessInfo.types';

export interface BusinessInfoFormProps {
  businessInfo: BusinessInfo;
  onSubmit: (data: BusinessInfoUpdate) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

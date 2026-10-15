import { type Property } from './Property';
import type { User } from './User';

export type InquiryStatus = 'NEW' | 'READ' | 'CONTACTED' | 'ARCHIVED';

export interface Inquiry {
  id: number;
  property: Property;
  user?: User;
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  clientPhone: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}
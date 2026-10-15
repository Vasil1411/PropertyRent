import {type User} from './User';


export interface Broker {
  id: number;
  user: User;
  phone: string;
  agencyName?: string;
  rating?: number; // BigDecimal в Java -> number в TS
}

export interface BrokerProfileRequest {
  phone: string;
  agencyName?: string;
}

export interface BrokerResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  agencyName?: string;
  rating?: number; // BigDecimal в Java се мапва към number
}
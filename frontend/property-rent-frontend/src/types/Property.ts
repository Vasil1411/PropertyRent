
import { type Broker, type BrokerResponse } from './Broker';

export interface PropertyImage {
  id: number;
  property?: Property;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
  publicId?: string;
}

export type PropertyType = 'APARTMENT' | 'HOUSE' | 'OFFICE' | 'GARAGE' | 'LAND' | 'COMMERCIAL';
export type DealType = 'RENT' | 'SALE';
export type PropertyStatus = 'ACTIVE' | 'RESERVED' | 'RENTED' | 'SOLD' | 'INACTIVE';

export interface Property {
  id: number;
  broker: Broker;
  title: string;
  description?: string;
  propertyType: PropertyType;
  dealType: DealType;
  status: PropertyStatus;
  price: number; // В Java е BigDecimal, в JSON/TS се мапва като number
  areaSqm: number;
  floor?: number;
  totalFloors?: number;
  roomsCount?: number;
  city: string;
  neighborhood?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  images: PropertyImage[];
  amenitiesText?: string;
}


export interface PropertyImageResponse {
  id: number;
  imageUrl: string;
}

export interface PropertyRequest {
  title: string;
  description?: string;
  propertyType: PropertyType;
  dealType: DealType;
  status: PropertyStatus;
  price: number;
  areaSqm: number;
  floor?: number;
  totalFloors?: number;
  roomsCount?: number;
  city: string;
  neighborhood?: string;
  address?: string;
  amenitiesText?: string;
}

export interface PropertyResponse {
  id: number;
  title: string;
  description?: string;
  propertyType: PropertyType;
  dealType: DealType;
  status: PropertyStatus;
  price: number;
  areaSqm: number;
  floor?: number;
  totalFloors?: number;
  roomsCount?: number;
  city: string;
  neighborhood?: string;
  address?: string;
  amenitiesText?: string;
  createdAt: string; // LocalDateTime се предава като ISO string през JSON
  updatedAt: string;
  broker: BrokerResponse;
  images: PropertyImageResponse[];
}
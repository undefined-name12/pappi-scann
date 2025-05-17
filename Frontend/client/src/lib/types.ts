export interface IP {
  ip: string;
  port: string;
  timestamp?: string;
}

export interface ClassifiedIP extends IP {
  service: string;
}

export interface Service {
  port: string;
  service: string;
}

export interface EnrichedIP {
  ip: string;
  port: string;
  hostname?: string;
  organization?: string;
  country?: string;
  banner?: string;
  timestamp?: string;
  id?: string;
}

export interface ApiError {
  message: string;
}

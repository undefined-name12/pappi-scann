export interface IP {
  ip: string;
  port: string;
  timestamp: string; // Changed from optional to required
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
  timestamp?: string; // Added to match client interface
  id?: string; // Added to match client interface
}

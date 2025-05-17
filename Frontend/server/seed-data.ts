// Utility script to seed the application with test data
// This is for demonstration purposes only

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { IP, Service, Enriched } from '../shared/schema';

// Fix for ESM modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data directory paths matching the application's expected structure
const BASE_PATH = path.join(process.env.HOME || '/home/runner', 'Cutie-Pie');
const SCANNER_PATH = path.join(BASE_PATH, 'logs', 'scanner');
const CLASSIFIED_PATH = path.join(SCANNER_PATH, 'classified');
const ENRICHED_PATH = path.join(SCANNER_PATH, 'enriched');

// File paths
const ALL_DATA_FILE = path.join(SCANNER_PATH, 'all.txt');
const ENRICHED_DATA_FILE = path.join(ENRICHED_PATH, 'enriched.json');

// Sample data for various services
const sampleIPs: IP[] = [
  // SSH IPs
  { ip: '192.168.1.5', port: '22', timestamp: new Date().toISOString() },
  { ip: '10.0.0.15', port: '22', timestamp: new Date().toISOString() },
  { ip: '172.16.0.25', port: '22', timestamp: new Date().toISOString() },
  { ip: '35.182.91.45', port: '22', timestamp: new Date().toISOString() },
  
  // HTTP IPs
  { ip: '192.168.1.10', port: '80', timestamp: new Date().toISOString() },
  { ip: '10.0.0.20', port: '80', timestamp: new Date().toISOString() },
  { ip: '172.16.0.30', port: '80', timestamp: new Date().toISOString() },
  { ip: '35.182.91.50', port: '80', timestamp: new Date().toISOString() },
  
  // HTTPS IPs
  { ip: '192.168.1.15', port: '443', timestamp: new Date().toISOString() },
  { ip: '10.0.0.25', port: '443', timestamp: new Date().toISOString() },
  { ip: '172.16.0.35', port: '443', timestamp: new Date().toISOString() },
  { ip: '35.182.91.55', port: '443', timestamp: new Date().toISOString() },
  
  // FTP IPs
  { ip: '192.168.1.20', port: '21', timestamp: new Date().toISOString() },
  { ip: '10.0.0.30', port: '21', timestamp: new Date().toISOString() },
  { ip: '172.16.0.40', port: '21', timestamp: new Date().toISOString() },
  
  // RDP IPs
  { ip: '192.168.1.25', port: '3389', timestamp: new Date().toISOString() },
  { ip: '10.0.0.35', port: '3389', timestamp: new Date().toISOString() },
  { ip: '172.16.0.45', port: '3389', timestamp: new Date().toISOString() },
  
  // Custom Services
  { ip: '192.168.1.30', port: '8080', timestamp: new Date().toISOString() },
  { ip: '192.168.1.35', port: '8080', timestamp: new Date().toISOString() },
  { ip: '10.0.0.40', port: '8080', timestamp: new Date().toISOString() },
  
  { ip: '192.168.1.40', port: '9090', timestamp: new Date().toISOString() },
  { ip: '10.0.0.45', port: '9090', timestamp: new Date().toISOString() },
  
  { ip: '192.168.1.45', port: '5432', timestamp: new Date().toISOString() },
  { ip: '10.0.0.50', port: '5432', timestamp: new Date().toISOString() },
  
  { ip: '192.168.1.50', port: '27017', timestamp: new Date().toISOString() },
  { ip: '10.0.0.55', port: '27017', timestamp: new Date().toISOString() },
];

// Sample enriched data
const sampleEnrichedIPs: Enriched[] = [
  {
    ip: '35.182.91.45',
    port: '22',
    hostname: 'ec2-35-182-91-45.ca-central-1.compute.amazonaws.com',
    organization: 'Amazon.com, Inc.',
    country: 'Canada',
    banner: 'SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.1'
  },
  {
    ip: '35.182.91.50',
    port: '80',
    hostname: 'ec2-35-182-91-50.ca-central-1.compute.amazonaws.com',
    organization: 'Amazon.com, Inc.',
    country: 'Canada',
    banner: 'Apache/2.4.52 (Ubuntu)'
  },
  {
    ip: '35.182.91.55',
    port: '443',
    hostname: 'ec2-35-182-91-55.ca-central-1.compute.amazonaws.com',
    organization: 'Amazon.com, Inc.',
    country: 'Canada',
    banner: 'nginx/1.18.0 (Ubuntu)'
  }
];

// Ensure the directories exist
if (!fs.existsSync(SCANNER_PATH)) {
  fs.mkdirSync(SCANNER_PATH, { recursive: true });
}
if (!fs.existsSync(CLASSIFIED_PATH)) {
  fs.mkdirSync(CLASSIFIED_PATH, { recursive: true });
}
if (!fs.existsSync(ENRICHED_PATH)) {
  fs.mkdirSync(ENRICHED_PATH, { recursive: true });
}

// Convert sample IPs to the expected format (all.txt is in ip:port format, one per line)
const allData = sampleIPs.map(ip => `${ip.ip}:${ip.port}`).join('\n');
fs.writeFileSync(ALL_DATA_FILE, allData);
console.log(`✓ Created sample IP data in ${ALL_DATA_FILE}`);

// Create classified files (one file per service port)
const serviceMap = new Map<string, IP[]>();
sampleIPs.forEach((ip: IP) => {
  if (!serviceMap.has(ip.port)) {
    serviceMap.set(ip.port, []);
  }
  serviceMap.get(ip.port)?.push(ip);
});

// Services names based on ports
const serviceNames: Record<string, string> = {
  '22': 'ssh',
  '80': 'http',
  '443': 'https',
  '21': 'ftp',
  '3389': 'rdp',
  '8080': 'webserver',
  '9090': 'gateway',
  '5432': 'postgresql',
  '27017': 'mongodb'
};

// Write classified files using Array.from to convert the Map entries to an array
Array.from(serviceMap.entries()).forEach(([port, ips]) => {
  const serviceName = serviceNames[port] || `port-${port}`;
  const classifiedFile = path.join(CLASSIFIED_PATH, `${serviceName}.txt`);
  const classifiedData = ips.map((ip: IP) => `${ip.ip}:${ip.port}`).join('\n');
  fs.writeFileSync(classifiedFile, classifiedData);
  console.log(`✓ Created classified data for ${serviceName} in ${classifiedFile}`);
});

// Write enriched data to file, one JSON object per line as expected by the app
const enrichedData = sampleEnrichedIPs.map(ip => JSON.stringify(ip)).join('\n');
fs.writeFileSync(ENRICHED_DATA_FILE, enrichedData);
console.log(`✓ Created sample enriched data in ${ENRICHED_DATA_FILE}`);

console.log('✓ Test data seeded successfully!');
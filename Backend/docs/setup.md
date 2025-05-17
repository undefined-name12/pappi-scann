# Cutie-Pie Setup Guide
## Base System
- OS: Kali Linux 2025.1 (VMware)
- VM Specs: 4 cores, 8GB RAM, 40GB disk, Bridged network
- Commands:
  ```bash
  sudo apt update && sudo apt full-upgrade -y
  sudo apt install -y open-vm-tools
  mkdir -p ~/Cutie-Pie/{docs,scripts,logs,config,soc,ai_bot,honeypot,scanner,frontend,backend,security,storage}
  cd ~/Cutie-Pie
  git init
  echo "# Cutie-Pie" > README.md
  git add README.md
  git commit -m "Initial commit"


# Scanner Module
## Purpose
Scans IPs for open services (e.g., HTTP) and logs results.

## Dependencies
- Pre-installed: masscan, nmap
- Python lib:
  ```bash
  pip3 install aiohttp asyncio --break-system-packages (for async scanning)
  sudo apt install -y tor proxychains
  sudo apt install -y masscan coreutils
  sudo apt install -y jq (in enrichment banner grabbing script)
  sudo apt install -y geoip-database geoip-bin  (This installs a basic GeoIP database at /usr/share/GeoIP/GeoIP.dat)
  sudo apt install -y dnsutils geoip-database geoip-bin whois curl parallel jq
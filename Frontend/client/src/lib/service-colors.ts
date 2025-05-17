export type ServiceColor = {
  text: string;
  bg: string;
  border: string;
  dot: string;
}

const colors: Record<string, ServiceColor> = {
  SSH: {
    text: 'text-[#00ff41]',
    bg: 'bg-[#00ff41]/10',
    border: 'border-[#00ff41]/30',
    dot: 'bg-[#00ff41]'
  },
  HTTP: {
    text: 'text-[#00c8ff]',
    bg: 'bg-[#00c8ff]/10',
    border: 'border-[#00c8ff]/30',
    dot: 'bg-[#00c8ff]'
  },
  HTTPS: {
    text: 'text-[#ff00ff]',
    bg: 'bg-[#ff00ff]/10',
    border: 'border-[#ff00ff]/30',
    dot: 'bg-[#ff00ff]'
  },
  FTP: {
    text: 'text-[#ffbf00]',
    bg: 'bg-[#ffbf00]/10',
    border: 'border-[#ffbf00]/30',
    dot: 'bg-[#ffbf00]'
  },
  RDP: {
    text: 'text-[#ff3e3e]',
    bg: 'bg-[#ff3e3e]/10',
    border: 'border-[#ff3e3e]/30',
    dot: 'bg-[#ff3e3e]'
  }
};

// Additional vibrant colors for random selection
const randomColors: ServiceColor[] = [
  {
    text: 'text-[#00ff41]', // Neon green
    bg: 'bg-[#00ff41]/10',
    border: 'border-[#00ff41]/30',
    dot: 'bg-[#00ff41]'
  },
  {
    text: 'text-[#00c8ff]', // Cyan
    bg: 'bg-[#00c8ff]/10',
    border: 'border-[#00c8ff]/30',
    dot: 'bg-[#00c8ff]'
  },
  {
    text: 'text-[#ff00ff]', // Magenta
    bg: 'bg-[#ff00ff]/10',
    border: 'border-[#ff00ff]/30',
    dot: 'bg-[#ff00ff]'
  },
  {
    text: 'text-[#ffbf00]', // Amber
    bg: 'bg-[#ffbf00]/10',
    border: 'border-[#ffbf00]/30',
    dot: 'bg-[#ffbf00]'
  },
  {
    text: 'text-[#ff3e3e]', // Red
    bg: 'bg-[#ff3e3e]/10',
    border: 'border-[#ff3e3e]/30',
    dot: 'bg-[#ff3e3e]'
  },
  {
    text: 'text-[#7b00ff]', // Purple
    bg: 'bg-[#7b00ff]/10',
    border: 'border-[#7b00ff]/30',
    dot: 'bg-[#7b00ff]'
  },
  {
    text: 'text-[#00ffb7]', // Mint
    bg: 'bg-[#00ffb7]/10',
    border: 'border-[#00ffb7]/30',
    dot: 'bg-[#00ffb7]'
  },
  {
    text: 'text-[#ff5500]', // Orange
    bg: 'bg-[#ff5500]/10',
    border: 'border-[#ff5500]/30',
    dot: 'bg-[#ff5500]'
  },
  {
    text: 'text-[#ffff00]', // Yellow
    bg: 'bg-[#ffff00]/10',
    border: 'border-[#ffff00]/30',
    dot: 'bg-[#ffff00]'
  },
  {
    text: 'text-[#ff0099]', // Pink
    bg: 'bg-[#ff0099]/10',
    border: 'border-[#ff0099]/30',
    dot: 'bg-[#ff0099]'
  }
];

// Used to generate a deterministic color based on service name
const getHashedColor = (service: string): ServiceColor => {
  const hash = service.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = hash % randomColors.length;
  return randomColors[colorIndex];
};

export const getServiceColor = (service: string): ServiceColor => {
  // Attempt to find the service by exact match
  if (colors[service]) {
    return colors[service];
  }
  
  // Or find a service that contains the name
  for (const [key, value] of Object.entries(colors)) {
    if (service.toUpperCase().includes(key)) {
      return value;
    }
  }
  
  // Use the hashed-based approach to select a color from our predefined cyberpunk palette
  return getHashedColor(service);
};

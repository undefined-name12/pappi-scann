import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set page title
document.title = "Cutie Pie - Live | Internet Monitoring System";

// Add meta description
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'Live Internet Monitor - Live Internet Monitoring System with real-time IP tracking and Shodan 2000-style UI';
document.head.appendChild(metaDescription);

// Add favicon
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/svg+xml';
favicon.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2300ff41' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpath d='M2 12h3'%3E%3C/path%3E%3Cpath d='M19 12h3'%3E%3C/path%3E%3Cpath d='M12 2v3'%3E%3C/path%3E%3Cpath d='M12 19v3'%3E%3C/path%3E%3Cpath d='m5 5 2.5 2.5'%3E%3C/path%3E%3Cpath d='M16.5 16.5 19 19'%3E%3C/path%3E%3Cpath d='m5 19 2.5-2.5'%3E%3C/path%3E%3Cpath d='M16.5 7.5 19 5'%3E%3C/path%3E%3C/svg%3E";
document.head.appendChild(favicon);

createRoot(document.getElementById("root")!).render(<App />);

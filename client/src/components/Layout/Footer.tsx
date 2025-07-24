import React from 'react';
import { Bus, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-primary to-primary-dark text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Bus className="h-6 w-6 text-white" />
              <span className="text-lg font-bold">SafariTrack</span>
            </div>
            <p className="text-white/80 text-sm">
              Making matatu travel predictable and convenient for everyone in Nairobi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/routes" className="text-white/80 hover:text-white hover:opacity-90 transition-opacity">
                  Find Routes
                </a>
              </li>
              <li>
                <a href="/schedules" className="text-white/80 hover:text-white hover:opacity-90 transition-opacity">
                  View Schedules
                </a>
              </li>
              <li>
                <a href="/register" className="text-white/80 hover:text-white hover:opacity-90 transition-opacity">
                  Join as Driver
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-white/80">
              <p>Email: info@safaritrack.co.ke</p>
              <p>Phone: +254 700 000 000</p>
              <p>Nairobi, Kenya</p>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-500 mt-8 pt-8 text-center">
          <p className="text-gray-200 text-sm flex items-center justify-center">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for Nairobi commuters
          </p>
          <p className="text-gray-300 text-xs mt-2">
            © 2024 SafariTrack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
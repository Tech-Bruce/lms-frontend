import logo from '../assets/lms.png';

const Footer = () => {
  return (
    <div className="overflow-hidden">
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main content section */}
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
          {/* Left section - Logo + About Us */}
          <div className="md:w-1/3 flex items-start gap-4">
            <img 
              src={logo} 
              alt="Logo" 
              className="h-28 w-28 object-cover rounded" 
            />
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-300 text-sm">
                Our learning platform brings together the best instructors and students from around the world.
              </p>
            </div>
          </div>

          {/* Middle section - Contact Us */}
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="text-gray-300 text-sm not-italic">
              123 Education Street<br />
              Learning City, LC 12345<br />
              <div className="mt-2">
                Email: info@imgplatform.com<br />
                Phone: (555) 123-4567
              </div>
            </address>
          </div>

          {/* Right section - Links */}
          <div className="flex md:w-1/3 justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {['Home', 'Courses', 'About', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-300 hover:text-white text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                {['Help Center', 'Terms of Service', 'Privacy Policy'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-300 hover:text-white text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            © 2025 LMS Platform. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>27°C Haze</span>
            <span>ENG</span>
            <span>1N</span>
            <span>10:34 AM</span>
            <span>09-07-2025</span>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Footer;
// src/admin/components/AdminFooter.jsx
export default function AdminFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-orange-600">Temple Admin Panel</span>
            <span>© {currentYear} All rights reserved.</span>
          </div>
          <div className="flex space-x-6 mt-2 md:mt-0">
            <a href="#" className="hover:text-orange-600 transition-colors">About</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
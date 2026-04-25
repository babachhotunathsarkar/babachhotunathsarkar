import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Menu,
  X,
  Bell,
  ChevronDown,
  Globe,
  User,
  LogOut,
  Settings,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationDropdown from "./NotificationDropdown";
import { fetchNotifications } from "../redux/notifications/notificationSlice";
import { fetchMarquees } from "../redux/marquee/marqueeSlice";
import { trackClick } from '../utils/analytics';

export default function Header({ onMenuClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Auth slice se data lo
  const { isAuthenticated: authIsAuthenticated } = useSelector(
    (state) => state.auth,
  );
  // ✅ User slice se data lo
  const { user } = useSelector((state) => state.user);

  // ✅ CORRECT: User logged in hai agar:
  // 1. user slice mein user object hai (direct check), ya
  // 2. auth slice mein isAuthenticated true hai
  const isUserLoggedIn = (user && user._id) || authIsAuthenticated;

  const notifications = useSelector((state) => state.notifications?.notifications || []);
  const unreadCount = notifications.filter((n) => !(n.isRead || n.isread || n.read)).length;

  const { items: allMarquees = [] } = useSelector((state) => state.marquee || {});
  const activeMarquees = allMarquees.filter(m => m.isActive).sort((a, b) => a.order - b.order);
  useEffect(() => {
    if (isUserLoggedIn) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, isUserLoggedIn]);

  useEffect(() => {
    dispatch(fetchMarquees());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/events", label: "Events" },
    { path: "/gallery", label: "Gallery" },
    { path: "/videos", label: "Videos" },
    { path: "/darbar-booking", label: "Token Booking" },
    { path: "/contact", label: "Contact" },
  ];


  const handleLogout = () => {
    // Clear everything
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Dispatch logout actions
    dispatch({ type: "auth/logout" });
    dispatch({ type: "user/clearUser" });

    setShowUserMenu(false);
    navigate("/");
  };

  // User initials
  const getUserInitials = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    return "U";
  };

  // Avatar background color
  const getAvatarColor = () => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    if (user?.name) return colors[user.name.length % colors.length];
    return "bg-orange-500";
  };
  // ── Language Dropdown Logic ──────────────────────────────────────────
  const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "hi", label: "Hindi", flag: "🇮🇳" },
    { code: "pa", label: "Punjabi", flag: "🇮🇳" },
  ];

  // Get current language from cookie or default to Hindi (as per request)
  const getSelectedLang = () => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("googtrans="))
      ?.split("=")[1];

    if (cookieValue) {
      const code = cookieValue.split("/")[2];
      return languages.find((l) => l.code === code) || languages[1];
    }
    return languages[1]; // Default to Hindi
  };

  const selectedLang = getSelectedLang();

  const handleLangChange = (langCode) => {
    document.cookie = `googtrans=/en/${langCode}; path=/`;
    document.cookie = `user_lang_set=${langCode}; path=/`;
    window.location.reload();
  };


  // Debug log
  console.log("🔍 Login Status:", {
    isUserLoggedIn,
    authIsAuthenticated,
    hasUser: !!(user && user._id),
    userName: user?.name,
  });

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-lg" : "bg-white/95 backdrop-blur-sm"
        }`}
    >
      {/* Top Marquee */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-1.5 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          {activeMarquees.length > 0 ? (
            // Duplicate the items array to ensure a smooth continuous loop
            [...activeMarquees, ...activeMarquees, ...activeMarquees].map((item, i) => (
              <span key={i} className="mx-8 font-medium tracking-wide">
                {item.text}
              </span>
            ))
          ) : (
            <>
              <span className="mx-8">बाबा छोटू नाथ सरकार सेवा समिति आप सभी का हार्दिक स्वागत करती है!</span>
              <span className="mx-8">जय बाबा छोटू नाथ की।</span>
              <span className="mx-8">जय गोगा जाहरवीर की।</span>
              <span className="mx-8">जय गुरु गोरखनाथ की।</span>
              <span className="mx-8">जय बाबा धर्मगिरि की।</span>
              <span className="mx-8">जय माता दी।</span>
            </>
          )}
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shadow-lg border-2 border-orange-500 flex-shrink-0">
              <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm md:text-base font-bold text-orange-700 leading-tight">
                Baba Chhotu Nath Sarkar Sewa Samiti
              </h1>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => trackClick(`nav_${link.label.toLowerCase().replace(/ /g, '_')}`)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${location.pathname === link.path
                  ? "bg-orange-100 text-orange-700"
                  : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Professional Language Dropdown */}
            <div className="relative lang-menu-container hidden md:block">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 border border-gray-100 group"
              >
                <div className="bg-orange-100 p-1 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold">{selectedLang.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showLangDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showLangDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-50 p-1"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLangChange(lang.code)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${selectedLang.code === lang.code
                          ? "bg-orange-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-orange-50"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{lang.flag}</span>
                          <span>{lang.label}</span>
                        </div>
                        {selectedLang.code === lang.code && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            {isUserLoggedIn && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <NotificationDropdown
                    onClose={() => setShowNotifications(false)}
                  />
                )}
              </div>
            )}

            {/* Donate */}
            <Link
              to="/donate"
              onClick={() => trackClick('header_donate_click')}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
            >
              Donate
            </Link>

            {/* ✅ FIXED: Use isUserLoggedIn instead of isAuthenticated */}
            {isUserLoggedIn && user ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-orange-400 transition-all"
                >
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden shadow-md">
                    <img
                      src={
                        user?.profileImage
                          ? user.profileImage
                          : "https://res.cloudinary.com/dwybfrbzi/image/upload/v1774718684/userdefaultimage_mqhu0r.png"
                      }
                      alt={user?.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <ChevronDown className="w-3 h-3 text-orange-600 hidden md:block" />
                </button>

                {/* Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                          <img
                            src={
                              user?.profileImage
                                ? user.profileImage
                                : "https://res.cloudinary.com/dwybfrbzi/image/upload/v1774718684/userdefaultimage_mqhu0r.png"
                            }
                            alt={user?.name || "User"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">
                            {user?.name || "User"}
                          </p>
                          <p className="text-orange-100 text-xs truncate">
                            {user?.email || ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      {user?.role !== "admin" && (
                        <>
                          <Link
                            to="/userDashboard"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                          >
                            <User className="w-4 h-4 text-orange-500" />
                            Dashboard
                          </Link>
                          <Link
                            to="/token-dashboard"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                          >
                            <Bell className="w-4 h-4 text-orange-500" />
                            Token Status
                          </Link>
                        </>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-orange-500" />
                        Profile
                      </Link>

                      {user?.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-orange-500" />
                          Admin Panel
                        </Link>
                      )}

                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-2 px-4 py-2 border-2 border-orange-500 text-orange-600 rounded-lg font-medium hover:bg-orange-500 hover:text-white transition-all"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="container mx-auto px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${location.pathname === link.path
                  ? "bg-orange-100 text-orange-700"
                  : "text-gray-700 hover:bg-orange-50"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 mb-3">Select Language</p>
              <div className="grid grid-cols-3 gap-2 px-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLangChange(lang.code)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all duration-300 ${selectedLang.code === lang.code
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-100 bg-gray-50 text-gray-600"
                      }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
              <Link
                to="/donate"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium text-center"
              >
                Donate
              </Link>
              {/* ✅ FIXED: Mobile menu mein bhi same condition */}
              {isUserLoggedIn && user ? (
                <>
                  {user?.role !== "admin" && (
                    <>
                      <Link
                        to="/userDashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 bg-orange-50 text-orange-600 rounded-lg font-medium text-center"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/token-dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 bg-orange-50 text-orange-600 rounded-lg font-medium text-center"
                      >
                        Token Status
                      </Link>
                    </>
                  )}
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 bg-orange-50 text-orange-600 rounded-lg font-medium text-center"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full px-4 py-3 border-2 border-red-500 text-red-600 rounded-lg font-medium text-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 border-2 border-orange-500 text-orange-600 rounded-lg font-medium text-center"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

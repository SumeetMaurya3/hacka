import { useState } from "react";
import {
  FaSearch,
  FaHome,
  FaTh,
  FaComments,
  FaUsers,
  FaBell,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { ReactNode } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-3">
        {/* Left Section - Logo */}
        <div className="text-xl font-bold">SimpliTrain</div>

        {/* Desktop Search Bar (hidden on mobile) */}
        <div className="relative w-80 hidden md:block">
          <input
            type="text"
            placeholder="What would you like to learn?"
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-500" />
        </div>

        {/* Desktop Navigation Icons */}
        <div className="hidden md:flex items-center space-x-6 text-gray-600">
          <NavItem icon={<FaHome />} label="Home" />
          <NavItem icon={<FaTh />} label="Categories" />
          <NavItem icon={<FaComments />} label="Chat" />
          <NavItem icon={<FaUsers />} label="Forum" />
          <NavItem icon={<FaBell />} label="Notification" />

          {/* Profile & Menu Icon */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md absolute top-full left-0 w-full flex flex-col items-center py-4 space-y-4">
          <NavItem icon={<FaHome />} label="Home" />
          <NavItem icon={<FaTh />} label="Categories" />
          <NavItem icon={<FaComments />} label="Chat" />
          <NavItem icon={<FaUsers />} label="Forum" />
          <NavItem icon={<FaBell />} label="Notification" />

          {/* Mobile Search Bar */}
          <div className="relative w-80 mt-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
          </div>
        </div>
      )}
    </nav>
  );
}

// Reusable Navigation Item
interface NavItemProps {
  icon: ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label }) => (
  <>
    <div className="flex flex-col items-center cursor-pointer hover:text-black transition">
      {icon}
      <span className="text-xs">{label}</span>
    </div>
  </>
);

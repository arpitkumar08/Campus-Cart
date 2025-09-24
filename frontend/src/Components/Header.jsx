import React, { useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import Button from './ui-header/Button';
import Avatar from './ui-header/Avatar';
import DropdownMenu from './ui-header/DropdownMenu';
import DropdownMenuItem from './ui-header/DropdownMenuItem';
import { useAuthStore } from '../store/authStore';
import Filter from './Filter/Filter';
import { useNavigate } from "react-router-dom";
import ProductUploadModal from './ProductUploadModal';
// import ThemeToggle from './ui/ThemeToggle'; // optional

const Header = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const { logout } = useAuthStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false); 
  

  const getMyListing = async () => {
        navigate("/mylisting"); // ✅ Go to MyListings page

  }

  const handleLogout = async () => {
    await logout();
  };

  const handleProductUpload = () => {
    setIsUploadOpen(true);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-transparent border-b border-gray-700/30 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center space-x-3">
              <span className="font-bold text-lg text-white/90 tracking-wide">
                Campus Exchange
              </span>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products, categories, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-2 pr-4 w-full rounded-lg bg-white/10 backdrop-blur-md border border-gray-400/20 placeholder-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white transition-all"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* <ThemeToggle /> */}

              {/* Filter */}
              <Filter />

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative group">
                <Bell className="h-5 w-5 text-white/80 group-hover:text-purple-400 transition-colors" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-purple-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu
                className="!bg-gray-800 !rounded-lg !shadow-xl !border !border-gray-600"
                children={{
                  trigger: (
                    <Avatar
                      src=""
                      alt={user?.fullName || 'User'}
                      className="h-8 w-8"
                    />
                  ),
                  content: (
                    <div className="!bg-gray-800 !rounded-lg !shadow-xl !border !border-gray-600 min-w-48 overflow-hidden">
                      <div className="p-3 border-b border-gray-600 !bg-gray-800">
                        <p className="text-sm font-medium text-white">
                          {user?.fullName || 'Guest'}
                        </p>
                        <p className="text-xs text-gray-300">{user?.email}</p>
                      </div>
                      <div className="py-1 !bg-gray-800 cursor-pointer">
                       
                        <DropdownMenuItem className="!text-gray-200 !hover:bg-gray-700 !bg-transparent px-3 py-2 cursor-pointer">
                          <button 
                          onClick={getMyListing}
                          className='cursor-pointer'
                          >
                            My Listings
                          </button>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="!text-gray-200 !hover:bg-gray-700 !bg-transparent px-3 py-2 cursor-pointer">
                          <button onClick={handleProductUpload} className="w-full text-left cursor-pointer">
                            Upload Product
                          </button>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="!text-gray-200 !hover:bg-gray-700 !bg-transparent px-3 py-2 cursor-pointer">
                          Favorites
                        </DropdownMenuItem>
                       
                        <div className="border-t border-gray-600 my-1"></div>
                        <DropdownMenuItem className="!text-gray-200 !hover:bg-gray-700 !bg-transparent px-3 py-2 cursor-pointer">
                          <button
                            onClick={handleLogout}
                            className="w-full text-red-400 text-left hover:text-red-300 cursor-pointer"
                          >
                            Log out
                          </button>
                        </DropdownMenuItem>
                      </div>
                    </div>
                  ),
                }}
              />

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-700/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full rounded-lg bg-white/10 backdrop-blur-md border border-gray-400/20 placeholder-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white transition-all"
                />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ✅ Product Upload Modal */}
      {isUploadOpen && (
        <ProductUploadModal onClose={() => setIsUploadOpen(false)} />
      )}
    </>
  );
};

export default Header;
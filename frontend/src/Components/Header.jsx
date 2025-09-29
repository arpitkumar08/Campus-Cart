import React from 'react';
import { Bell, Menu } from 'lucide-react';
import Button from './ui-header/Button';
import Avatar from './ui-header/Avatar';
import DropdownMenu from './ui-header/DropdownMenu';
import DropdownMenuItem from './ui-header/DropdownMenuItem';
import { useAuthStore } from '../store/useAuthStore';
import Filter from './Filter/Filter'; // No need to pass props anymore
import { useNavigate } from "react-router-dom";
import ProductUploadModal from './ProductUploadModal';
import SearchBar from './ui-header/SearchBar';
import useSearchStore from '../store/useSearchStore';

const Header = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const { query, setQuery } = useSearchStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);

  const getMyListing = () => navigate("/mylisting");
  const getMyFavourites = () => navigate("/favourite");
  const getChats = () => navigate('/chat'); // remove :conversationId placeholder
  const handleLogout = async () => await logout();
  const handleProductUpload = () => setIsUploadOpen(true);

  return (
    <>
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
              <SearchBar searchQuery={query} setSearchQuery={setQuery} />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Filter component - no props needed, uses global state */}
              <Filter />

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
                        <DropdownMenuItem>
                          <button onClick={getMyListing}>My Listings</button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <button onClick={handleProductUpload}>Upload Product</button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <button onClick={getChats}>My Chats</button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <button onClick={getMyFavourites}>Favorites</button>
                        </DropdownMenuItem>

                        <div className="border-t border-gray-600 my-1"></div>
                        <DropdownMenuItem>
                          <button
                            onClick={handleLogout}
                            className="w-full text-red-400 text-left hover:text-red-300"
                          >
                            Log out
                          </button>
                        </DropdownMenuItem>
                      </div>
                    </div>
                  ),
                }}
              />

              {/* Mobile Menu */}
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
              <SearchBar
                searchQuery={query}
                setSearchQuery={setQuery}
                className="w-full"
              />
            </div>
          )}
        </div>
      </nav>

      {/* Product Upload Modal */}
      {isUploadOpen && (
        <ProductUploadModal onClose={() => setIsUploadOpen(false)} />
      )}
    </>
  );
};

export default Header;
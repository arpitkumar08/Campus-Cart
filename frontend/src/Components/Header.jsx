import React, { useEffect, useState } from "react";
import { Bell, Menu, MessageSquare } from "lucide-react"; // Import MessageSquare
import Button from "./ui-header/Button";
import Avatar from "./ui-header/Avatar";
import DropdownMenu from "./ui-header/DropdownMenu";
import DropdownMenuItem from "./ui-header/DropdownMenuItem";
import { useAuthStore } from "../store/useAuthStore";
import Filter from "./Filter/Filter";
import { useNavigate } from "react-router-dom";
import ProductUploadModal from "./Modals/ProductUploadModal";
import SearchBar from "./ui-header/SearchBar";
import useSearchStore from "../store/useSearchStore";
import { socket } from "../Context/socket";
import { useChatStore } from "../store/useChatStore";

const Header = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const { query, setQuery } = useSearchStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const conversations = useChatStore((state) => state.conversations);
  const fetchConversations = useChatStore((state) => state.getConversations);
  const incrementUnreadCount = useChatStore(
    (state) => state.incrementUnreadCount
  );

  const unreadCount = conversations.reduce(
    (sum, conv) => sum + (conv.unreadCount || 0),
    0
  );

  // ✅ NEW: Create a filtered list of only the conversations with unread messages
  const unreadConversations = conversations.filter(
    (conv) => conv.unreadCount > 0
  );


  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const getMyListing = () => navigate("/mylisting");
  const getMyFavourites = () => navigate("/favourite");

  const getChats = () => {
    navigate("/chat");
    setIsNotificationOpen(false);
  };

  const handleLogout = async () => await logout();
  const handleProductUpload = () => setIsUploadOpen(true);

  useEffect(() => {
    fetchConversations();

    const handleReceiveMessage = (message) => {
      if (message.senderId !== user?._id) {
        incrementUnreadCount(message.conversationId);
      } else {
        console.log(
          "⏭️ SOCKET: Message is from current user, skipping increment"
        );
      }
      fetchConversations();
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [fetchConversations, incrementUnreadCount, user?._id]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchConversations();
      }
    };
    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchConversations]);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-transparent border-b border-gray-700/30 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-lg text-white/90 tracking-wide">
                Campus Exchange
              </span>
            </div>

            <div className="hidden md:flex flex-1 max-w-lg mx-6">
              <SearchBar searchQuery={query} setSearchQuery={setQuery} />
            </div>

            <div className="flex items-center space-x-3 relative">
              <Filter />
              <Button
                variant="ghost"
                size="icon"
                className="relative group"
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                }}
              >
                <Bell className="h-5 w-5 text-white/80 group-hover:text-purple-400 transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-purple-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {/* ✅ UPDATED NOTIFICATION PANEL */}
              {isNotificationOpen && (
                <div className="absolute top-14 right-0 w-80 max-w-sm bg-gray-900 text-white rounded-lg shadow-xl border border-gray-700 z-50">
                  <div className="p-3 border-b border-gray-700">
                    <h3 className="font-semibold text-white">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {unreadConversations.length > 0 ? (
                      <ul>
                        {unreadConversations.map((conv) => (
                          <li
                            key={conv._id}
                            className="border-b border-gray-800 last:border-b-0"
                          >
                            <div
                              className="flex items-start p-3 hover:bg-gray-800 cursor-pointer transition-colors"
                              onClick={getChats}
                            >
                              <div className="flex-shrink-0 mt-1">
                                <MessageSquare className="h-5 w-5 text-purple-400" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-gray-200">
                                  New message about{" "}
                                  <span className="font-bold text-white">
                                    {conv.product?.title || "an item"}
                                  </span>
                                </p>
                                <span className="text-xs text-purple-400 bg-purple-900/50 px-2 py-0.5 rounded-full mt-1 inline-block">
                                  {conv.unreadCount} new message
                                  {conv.unreadCount > 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400 p-4 text-center">
                        You're all caught up!
                      </p>
                    )}
                  </div>
                  {unreadConversations.length > 0 && (
                    <div className="p-2 bg-gray-900/50 border-t border-gray-700 text-center">
                      <button
                        onClick={getChats}
                        className="w-full text-purple-400 hover:text-purple-300 text-sm py-1 font-medium transition-colors"
                      >
                        View All Chats
                      </button>
                    </div>
                  )}
                </div>
              )}

              <DropdownMenu
                className="!bg-gray-800 !rounded-lg !shadow-xl !border !border-gray-600"
                children={{
                  trigger: (
                    <Avatar
                      src=""
                      alt={user?.fullName || "User"}
                      className="h-8 w-8"
                    />
                  ),
                  content: (
                    <div className="!bg-gray-800 !rounded-lg !shadow-xl !border !border-gray-600 min-w-48 overflow-hidden">
                      <div className="py-1 !bg-gray-800 cursor-pointer">
                        <DropdownMenuItem>
                          <button onClick={getMyListing}>My Listings</button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <button onClick={handleProductUpload}>
                            Upload Product
                          </button>
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
              <div className="">
                <p className="text-sm font-medium text-white">
                  Hey, {user?.fullName?.split(" ")[0] || "User"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
              >
                <Menu className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>

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

      {isUploadOpen && (
        <ProductUploadModal onClose={() => setIsUploadOpen(false)} />
      )}
    </>
  );
};

export default Header;

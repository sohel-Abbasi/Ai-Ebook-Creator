import React from "react";
import { ChevronDown, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  companyName,
  email,
  userRole,
  onLogout,
}) => {
  const navigate = useNavigate();
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-100"
      >
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-9 h-9 object-cover rounded-xl border border-gray-200"
          />
        ) : (
          <div
            className="w-9 h-9 bg-gradient-to-br from-violet-400 to-purple-500
              rounded-xl flex items-center justify-center shadow-sm"
          >
            <span className="text-white font-semibold text-sm">
              {companyName?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900 leading-none mb-1">
            {companyName}
          </p>
          <p className="text-xs text-gray-500 leading-none">{email}</p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute w-64 mt-2 right-0 bg-white rounded-xl border border-gray-100 shadow-xl ring-1 ring-black ring-opacity-5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-4 py-4 border-b border-gray-50 bg-gray-50/50 rounded-t-xl">
            <p className="text-sm font-medium text-gray-900 truncate">
              {companyName}
            </p>
            <p className="text-xs text-gray-500 truncate">{email}</p>
          </div>

          <div className="p-2">
            <button
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-lg transition-colors duration-200"
              onClick={() => navigate("/profile")}
            >
              <User className="w-4 h-4" />
              <span>View Profile</span>
            </button>

            <div className="h-px bg-gray-100 my-2" />

            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;

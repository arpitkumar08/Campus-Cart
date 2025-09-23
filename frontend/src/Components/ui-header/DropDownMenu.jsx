import React, { useState, useEffect, useRef } from 'react';

const DropdownMenu = ({ children }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If click is outside the dropdown, close it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {children.trigger}
      </div>
      {open && (
        <div className="absolute right-0 mt-2 w-48 backdrop-blur-md rounded-lg shadow-lg p-2 text-white z-50">
          {children.content}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;

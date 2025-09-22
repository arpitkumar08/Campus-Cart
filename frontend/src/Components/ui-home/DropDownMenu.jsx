import React, { useState } from 'react';

const DropdownMenu = ({ children }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <div onClick={() => setOpen(!open)} className="cursor-pointer">{children.trigger}</div>
            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-2 text-white z-50">
                    {children.content}
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;

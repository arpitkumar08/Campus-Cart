import React from 'react';
import { User } from 'lucide-react';

const Avatar = ({ src, alt, className }) => (
    <div className={`rounded-full overflow-hidden ${className} bg-white/10`}>
        {src ? <img src={src} alt={alt} /> : <User className="h-full w-full text-white p-1" />}
    </div>
);

export default Avatar;

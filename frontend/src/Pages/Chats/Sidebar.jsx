import { Users } from 'lucide-react'
import React, { useState } from 'react'

const Sidebar = () => {


    const [showOnlineOnly, setShowOnlineOnly] = useState(false)

    return (
        <aside className='h-full w-20 lg:w-72 border-r border-white flex flex-col transition-all duration-200'>
            <div className='border-b border-white w-full p-5'>
                <div className='flex items-center gap-2'>
                    <Users className='size-6 text-white' />
                    <span className="font-medium hidden lg:block text-white">Contacts</span>
                </div>

                <div className='mt-3 hidden lg:flex items-center gap-2'>
                    <label className='cursor-pointer flex items-center gap-2'>
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="checkbox checkbox-sm"
                        />
                        <span className="text-sm text-white">Show online only</span>

                    </label>
                </div>

            </div>
        </aside>
    )
}

export default Sidebar

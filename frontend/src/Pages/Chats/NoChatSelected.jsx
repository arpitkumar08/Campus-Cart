import { MessagesSquare } from 'lucide-react';
import React from 'react'

const NoChatSelected = () => {
    return (
        <div className='w-full flex flex-1 flex-col items-center justify-center p-16 bg-slate-900'>
            <div className='max-w-md text-center space-y-6'>
                <div className='relative'>
                    <div className='w-20 h-18 rounded-2xl flex items-center justify-center animate-bounce'>
                        <MessagesSquare className='w-12 h-12 text-white' />

                    </div>

                </div>

            </div>

            <h2 className='text-white font-bold'>Chat with your seller</h2>
            <p className='text-white'>Select a conversation from the sidebar to start chatting</p>

        </div>
    )
}

export default NoChatSelected

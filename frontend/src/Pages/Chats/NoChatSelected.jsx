import { MessageSquare } from 'lucide-react'
import React from 'react'

const NoChatSelected = () => {
    return (
        <div className='w-full flex flex-1 flex-col items-center justify-center p-16 bg-black/50'>
            <div className='max-w-md text-center space-y-6'>
                <div className='relative'>
                    <div className='w-8 h-8 rounded-2xl flex items-center justify-center animate-bounce'>
                        <MessageSquare className='w-8 h-8 text-white' />

                    </div>

                </div>

            </div>

            <h2 className='text-white font-bold'>Chat with your seller</h2>
            <p className='text-white'>Select a conversation from the sidebar to start chatting</p>

        </div>
    )
}

export default NoChatSelected

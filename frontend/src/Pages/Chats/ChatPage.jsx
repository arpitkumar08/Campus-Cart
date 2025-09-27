import React from 'react'
import Sidebar from './Sidebar'
import { useChatStore } from '../../store/chatStore'
import NoChatSelected from './NoChatSelected'
import ChatContainer from './ChatContainer'

const ChatPage = () => {

    const { selectedUser } = useChatStore()
    return (
        <div className='h-screen bg-zinc-700'>
            <div className='flex items-center justify-center pt-20 px-4'>
                <div className='rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]'>
                    <div className='flex h-full rounded-lg overflow-hidden'>
                        <Sidebar />

                        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}

                    </div>
                </div>

            </div>

        </div>
    )
}

export default ChatPage

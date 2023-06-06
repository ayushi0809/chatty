'use client'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { User } from 'lucide-react'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'

interface FreindRequestSideBarOptionProps {
    sessionId:string,
    initialUnseenRequesCount: number
}

const FreindRequestSideBarOption: FC<FreindRequestSideBarOptionProps> = ({sessionId , initialUnseenRequesCount}) => {
    const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
        initialUnseenRequesCount
    )

    useEffect(() =>{
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
        const friendRequestHandler = () =>{
            setUnseenRequestCount((prev) => prev+1)
        }
        pusherClient.bind('incoming_friend_requests', friendRequestHandler)
        return () =>{
          pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
    
          pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
        }
      }, [])

  return <div className='-mx-2 space-y-1'>
  <Link href='/dashboard/requests' className='text-white hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'>
    <div className='text-gray-400 border-gray-200 group-hover:border-black group-hover:text-gray-600 flex h-6 w-6 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-slate-900'>
        <User className='h-4 w-4'></User>
    </div>
    <p className='turncate'> Friend Requests</p>
    {
        unseenRequestCount > 0 ? (<div className='rounded-full h-5 w-5 text-xs flex justify-center items-center text-indigo-600 bg-white'>
           {unseenRequestCount}
        </div>) : null
    }
  </Link>
  </div>
}

export default FreindRequestSideBarOption
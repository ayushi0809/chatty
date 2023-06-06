"use client";
import { X } from "lucide-react";
import { Check, UserPlus } from "lucide-react";
import { FC, useEffect, useState } from "react";
import axios from 'axios';
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

interface FriendRequestProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionId: string;
}

const FriendRequest: FC<FriendRequestProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
    const router = useRouter();
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );
  useEffect(() =>{
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
    const friendRequestHandler = ({senderId, senderEmail}: IncomingFriendRequest)  =>{
      setFriendRequests((prev) => [...prev , {senderId, senderEmail}])
    }
    pusherClient.bind('incoming_friend_requests', friendRequestHandler)
    return () =>{
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))

      pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
    }
  }, [])
  const acceptFriend = async (senderId: string) =>{
    await axios.post('/api/friends/accept' , {id : senderId})
     setFriendRequests((prev) =>
        prev.filter((request) => request.senderId != senderId)
     )
     router.refresh();
  }
  const denyFriend = async (senderId: string) =>{
    await axios.post('/api/friends/deny' , {id : senderId})
     setFriendRequests((prev) =>
        prev.filter((request) => request.senderId != senderId)
     )
     router.refresh();
  }

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing to show here</p>
      ) : (
        friendRequests.map((request) => {
            return <div key={request.senderId} className="flex gap-4 items-center">
            <UserPlus className="text-black"></UserPlus>
            <p className="font-medium text-lg">{request.senderEmail}</p>
            <button
            onClick={() => acceptFriend(request.senderId)}
              aria-aria-label="accept friend"
              className="w-8 h-8 bg-slate-900 hover:bg-slate-700 grid place-items-center rounded-full transition hover:shadow-md"
            >
              <Check className="font-semibold text-white w-3/4 h-3/4"></Check>
            </button>

            <button
            onClick={() => denyFriend(request.senderId)}
              aria-aria-label="deny friend"
              className="w-8 h-8 bg-red-900 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
            >
              <X className="font-semibold text-white w-3/4 h-3/4"></X>
            </button>
          </div>;
            
        })
      )}
    </>
  );
};

export default FriendRequest;

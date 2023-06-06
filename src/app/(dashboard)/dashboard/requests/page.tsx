import FriendRequest from '@/components/FriendRequest';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation';
import { FC } from 'react'


const page = async () => {
    const session = await getServerSession(authOptions);
    if(!session) notFound();
    //ids of people who sent us friend request
    const incomingSenderIds = await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_requests`) as string [];
    //Promise.all calls all the function together without waiting for other to finish it get get resolve only if all the promises get resolve
    const incomingFriendRequests = await Promise.all(
        incomingSenderIds.map(async(senderId) =>{
            const sender = (await fetchRedis('get' , `user:${senderId}`)) as string
            const senderParsed = JSON.parse(sender) as User
           
            return {
              senderId,
              senderEmail : senderParsed.email,
              senderName : senderParsed.name,
              senderImage: senderParsed.image
            }
        })
    )
    console.log(incomingFriendRequests);
  return <main className='pt-8'>
    <div className='flex flex-col gap-4'>
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
  <h2 className="text-xl font-semibold mb-4 grid place-items-center">Friend Request</h2>
        <FriendRequest incomingFriendRequests={incomingFriendRequests} sessionId={session.user.id}/>
        </div>
    </div>

  </main>
}

export default page
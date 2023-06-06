import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { addFreindValidator } from "@/lib/validation/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email: emailToAdd } = addFreindValidator.parse(body.email)
        // const RESTResponse = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/user:email${emailToAdd}`, {
        //     headers: {
        //         Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,

        //     },
        //     cache: 'no-store',
        // })
        // const data = await RESTResponse.json() as { result: string }
        const idToAdd = await fetchRedis('get', `user:email:${emailToAdd}`) as string
        //console.log(idToAdd);
        if (!idToAdd) {
            return new Response('this person doesnt exist', { status: 400 })
        }
        const session = await getServerSession(authOptions)
        if (!session) {
            return new Response('Unauthorized', { status: 401 })
        }
        if (idToAdd === session.user.id) {
            return new Response("you cant add yourself as a friend", { status: 400 })
        }
        //check user is already added
        const isAlreadyAdded = await fetchRedis('sismember', `user:${idToAdd}:incoming_friend_requests`, session.user.id) as 0 | 1
        if (isAlreadyAdded) {
            return new Response('Already added this user', { status: 400 })
        }
        const isAlreadyFriend = await fetchRedis('sismember', `user:${session.user.id}:friends`, idToAdd) as 0 | 1

        if (isAlreadyFriend) {
            return new Response('Already Friend', { status: 400 })
        }
        pusherServer.trigger(
            toPusherKey(`user:${idToAdd}:incoming_friend_requests`), 'incoming_friend_requests',
            {
                senderId: session.user.id,
                senderEmail: session.user.email,

            })

        db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id)
        return new Response('OK')
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Invalid request payload', { status: 422 })
        }
        if (error) {
            console.log(error);
            return new Response('Invalid Request', { status: 400 })
        }


    }

}
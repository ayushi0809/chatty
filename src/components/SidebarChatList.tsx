"use client";
import { chatHrefConstructor } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useReducer, useState } from "react";
import Image from "next/image";

interface SidebarChatListProps {
  friends: User[];
  sessionId: string;
}

const SidebarChatList: FC<SidebarChatListProps> = ({ sessionId, friends }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [unSeenMessages, setunSeenMessages] = useState<Message[]>([]);
  useEffect(() => {
    if (pathname?.includes("chat")) {
      setunSeenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);
  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {friends.sort().map((friend) => {
        const unSeenMessagesCount = unSeenMessages.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id;
        }).length;

        return (
          <li key={friend.id}>
            <a
              href={`dashboard/chat/${chatHrefConstructor(
                sessionId,
                friend.id
              )}`}
              className="text-white hover:text-indigo-600 hover:bg-white group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
            >
                <div className="relative h-8 w-8 bg-slate-900 group-hover:bg-white group-hover:border-black group-hover:text-gray-600">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={friend.image || " "}
                    alt="Your Profile picture"
                  ></Image>
                </div>
              {friend.name}
              {unSeenMessagesCount >0 ? <div className="bg-white font-medium text-xs text-slate-900 w-4 h-4 rounded-full flex justify-center items-center">{unSeenMessagesCount}</div> : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;

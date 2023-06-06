import FreindRequestSideBarOption from "@/components/FreindRequestSideBarOption";
import { Icon, Icons } from "@/components/Icons";
import SidebarChatList from "@/components/SidebarChatList";
import SignOutButton from "@/components/SignOutButton";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}
interface SidebarOptions {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
}
const sidebarOptions: SidebarOptions[] = [
  {
    id: 1,
    name: "Add Friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
];
const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  const friends = await getFriendsByUserId(session.user.id)
  const unseenRequestCount = (
    await fetchRedis(
      "smembers",
      `user:${session.user.id}:incoming_friend_requests`
    ) as User[]
  ).length;

  return (
    <div className=" w-full flex h-screen">
      <div className="flex h-full w-full max-w-xs flex-col gap-y-5 border-r border-gray-200 bg-slate-900 px-6">
        <Link href="/dashboard" className="flex h-16 items-center">
          <Icons.Logo className="h-8 w-auto text-indigo-600" />
        </Link>

        { friends.length > 0 ? <div className="text-xs font-semibold leading-6 text-white">
          Your chats
        </div> : null}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
           <li><SidebarChatList sessionId = {session.user.id}friends={friends}/></li>
            <li>
              <div className="text-xs font-semibold leading-6 text-white">
                Overview
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {sidebarOptions.map((option) => {
                  const Icon = Icons[option.Icon];
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className="text-white hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      >
                        <span className="text-gray-400 border-gray-200 group-hover:border-black group-hover:text-gray-600 flex h-6 w-6 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-slate-900">
                          <Icon className="h-4 w-4"></Icon>
                        </span>
                        <span className="turncate">{option.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li>
              <FreindRequestSideBarOption
                sessionId={session.user.id}
                initialUnseenRequesCount={unseenRequestCount}
              />
            </li>
            <li className="-mx-8 mt-auto flex items-center">
              <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white">
                <div className="relative h-8 w-8 bg-slate-900">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={session.user.image || " "}
                    alt="Your Profile picture"
                  ></Image>
                </div>
                <span className="sr-only">Your Profile</span>
                <div className="flex flex-col">
                  <span aria-hidden="true">{session.user.name}</span>
                  <span className="text-xs text-zinc-400" aria-hidden="true">
                    {session.user.email}
                  </span>
                </div>

                <SignOutButton className="h-full aspect-square hover:bg-white"></SignOutButton>
              </div>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex-grow flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default Layout;

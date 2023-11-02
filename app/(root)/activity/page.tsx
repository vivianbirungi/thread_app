import UserCard from "@/components/cards/UserCard";
import { fetchUser, fetchUsers, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import { redirect } from "next/navigation";

async function Page({params}:{params:{id:string}}){
    const user = await currentUser();
    if(!user) return null;
    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding');
    // get activity;
    const activity = await getActivity(userInfo._id);
    console.log(activity)
  return (
    <div>
      <section>
        <h1 className="head-text mb-10">Activity</h1>
        <section className="mt-10 flex flex-col gap-5">
          {activity?.length > 0 ? (
            <>
            {activity?.map((item) =>(
              <Link key={item._id} href = {`/thread/${item.parentId}`}>
                <article className="activity-card">
                  <Image
                  src={item.author.image}
                  alt="Profile "
                  width={20}
                  height={20}
                  className="rounded-full object-cover"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {item.author.name}

                    </span>{" "}
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
            </>
          ): <p className="!text-base-regular text">No Activity yet</p>}
        </section>
      </section>
    </div>
  )
}

export default Page

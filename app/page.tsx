import { Button } from "@/components/ui/button";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const {isAuthenticated} = getKindeServerSession()
  const isLoggedIn = await isAuthenticated()

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="max-w-7xl mx-auto ">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <p> Your Personal Workspace </p>
            <p className="text-5xl md:text-6xl">
              for <span className="text-lime-500">better productivity</span>
            </p>
          </h1>
          <p className="mt-6 text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid dignissimo Lorem ipsum dolor sit  iusto! 
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            {
              isLoggedIn ? <>
              <Button asChild>
                <Link href={"/workspace"}>Go to Workspace</Link>
              </Button>
              </> : <>
              </>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

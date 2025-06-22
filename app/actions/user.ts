"use server"

import { UserDataType } from "@/components/onboarding-form"
import { userRequired } from "../data/user/is-User-Authenticated"
import { userSchema } from "@/lib/schema"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export const createUser = async (data: UserDataType) => {
    const { user } = await userRequired()

    const validateData = userSchema.parse(data)

    const userData = await db.user.create({
        data: {
            id: user?.id as string,
            email: user?.email as string,
            name: validateData.name,
            about: validateData.about,
            country: validateData.country,
            industryType: validateData.industryType,
            role: validateData.role,
            onboardingCompleted: true,
            image: user?.picture || "",
            subscription: {
                create: {
                    plan: "FREE",
                    status: "ACTIVE",
                    currentPeriodEnd: new Date(),
                    cancelAtPeriodEnd: false
                }
            }

        },
        select: {
            id: true, 
            name: true, 
            email: true, 
            workspaces: true
        }
    })

    // TODO: send user welcome email

    if(userData.workspaces.length === 0){
        redirect("/create-workspace")
    }

    redirect("workspace");
};
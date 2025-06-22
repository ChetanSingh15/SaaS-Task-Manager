import { db } from "@/lib/db";
import { userRequired } from "./is-User-Authenticated"

export const getuserById = async () => {
    try {
        const {user} =  await userRequired();

        const data = await db.user.findUnique({
            where: {id: user?.id}
        })
        return data;
    } catch (error) {
        console.log(error)
        return {
            success: false, error: true, message: " Failed to get user by Id" , status: 500
        }
    }
}
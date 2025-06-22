import { db } from "@/lib/db";
import { userRequired } from "../user/is-User-Authenticated"



export const getUserWorkspaces = async () => {
    try {
        const {user} = await userRequired();
        const workspaces = await db.user.findUnique({
            where: {id: user?.id},
            include: {
                workspaces : {
                    select: {
                        id: true,
                        userId: true,
                        workspaceId: true,
                        acessLevel: true, 
                        createdAt: true,
                        workspace: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })
        
        return {data:workspaces}
    } catch (error) {
        console.log(error)
        return {
            success: false, 
            error: true, 
            message: "Failed to fetch workspaces", 
            status: 500
        }
    }
}
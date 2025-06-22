import React from 'react'
import { CreateworkspaceForm } from '@/components/workspace/create-workspace-form'
import { getUserWorkspaces } from '@/app/data/workspace/get-user-workspaces'
import { redirect } from 'next/navigation'

const page = async () => {
    const {data} = await getUserWorkspaces()

    if(!data?.onboardingCompleted) redirect("/onboarding");
    return (
    <div>
        <CreateworkspaceForm />
    </div>
  )
}

export default page
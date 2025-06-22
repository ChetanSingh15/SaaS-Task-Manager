"use client"
import { workspaceSchema } from '@/lib/schema';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { createNewWorkspace } from '@/app/actions/workspace';
import { useRouter } from 'next/navigation';



export type createWorkspaceDataType = z.infer<typeof workspaceSchema>
 

export const CreateworkspaceForm = () => {
    const [pending, setPending] = useState(false);
    const router = useRouter()


    const form = useForm<createWorkspaceDataType>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            description: "",
            name: "",
        }
    });

    const onSubmit = async (data: createWorkspaceDataType) => {
      try {
        setPending(true);
        const {data: res} = await createNewWorkspace(data);

        toast.success("Workspace created successfully");
        router.push(`/workspace/${res?.id as string}`)
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong")
      }
    }
    return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create New Workspace</CardTitle>
          <CardDescription>
            Setup a workspace for yourself and team
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter workspace name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Workspace Description"
                        className="resize-none"
                      ></Textarea>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className='flex flex-row items-center gap-4'>
                <Button type="button" variant={"outline"} disabled={pending}>
                    Cancel
                </Button>
                <Button type="submit" disabled={pending} className="w-full">
                    Create Workspace
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {toast} from "sonner";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {supabase} from "@/lib/supabase/client";
import {useUser} from "@/hooks/use-user";
import {LoadingIcon} from "@/components/atoms/loading-icon";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {getInitials} from "@/lib/utils";
import {Camera} from "lucide-react";


const profileFormSchema = z.object({
  avatar: z.instanceof(FileList).optional(),
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  full_name: z
    .string()
    .min(1, {
      message: "Full Name cannot be empty.",
    }),
  website: z.union([
    z.string().url({message: "Website URL must be valid."}),
    z.string().length(0),
  ]).transform(v => v || undefined),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.

export function ProfileForm() {
  const [loading, setLoading] = useState(false)
  const {user} = useUser()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      full_name: "",
      website: "",
    },
    mode: "onChange",
  })

  useEffect(() => {
    if (!user) return
    form.reset({
      username: user.username || "",
      full_name: user.name || "",
      website: user.website || "",
    })
  }, [user, form])

  async function onSubmit(data: ProfileFormValues) {
    setLoading(true)
    const {error} = await supabase.from("profiles").upsert({
      ...data,
      id: user?.id,
    })
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile updated.");
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          render={(({field}) => (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <FormLabel>
                  <Avatar className="w-36 h-36 border-2 cursor-pointer">
                    <AvatarImage
                      src={user?.avatar}
                      alt={user?.name}
                      className="animate-in fade-in-50 zoom-in-90"
                    />
                    <AvatarFallback
                      className="rounded-md text-6xl text-muted-foreground">{getInitials(user?.name)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 p-2 bg-primary rounded-full">
                    <Camera className="w-5 h-5 text-primary-foreground"/>
                  </div>
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    className="mt-2 sr-only"
                    {...field}
                  />
                </FormControl>
                <FormMessage/>
              </div>
            </div>
          ))}
          name="avatar"
        />
        <FormField
          control={form.control}
          name="username"
          render={({field}) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField /* Full Name */
          control={form.control}
          name="full_name"
          render={({field}) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Full Name" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField /* Website */
          control={form.control}
          name="website"
          render={({field}) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="www.example.com" {...field} />
              </FormControl>
              <FormDescription>Add your personal website or blog.</FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          <LoadingIcon loading={loading}/>
          Update profile
        </Button>
      </form>
    </Form>
  )
}
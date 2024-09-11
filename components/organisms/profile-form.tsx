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
  const [avatar, setAvatar] = useState("")
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

  const fileRef = form.register("avatar")

  useEffect(() => {
    if (!user) return
    form.reset({
      username: user.username || "",
      full_name: user.name || "",
      website: user.website || "",
    })
  }, [user, form])

  function handlePreview(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length) {
      setAvatar(URL.createObjectURL(event.target.files[0]))
    }
    return fileRef.onChange(event)
  }

  async function onSubmit(data: ProfileFormValues) {
    setLoading(true)
    let avatar_url: string | undefined = undefined;
    if (data.avatar && data.avatar.length) {
      const file = data.avatar[0]
      const fileName = `${user?.id}_${new Date().getTime()}_${file.name}`
      const fileData = await supabase.storage.from("avatars").upload(fileName, file)
      if (fileData.error) {
        toast.error(fileData.error.message)
        setLoading(false)
        return
      }
      const {data: {publicUrl}} = supabase.storage.from("avatars").getPublicUrl(fileData.data.path);
      avatar_url = publicUrl
    }
    const {error} = await supabase.from("profiles").upsert({
      id: user?.id,
      username: data.username,
      full_name: data.full_name,
      website: data.website,
      avatar_url,
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
          render={(() => (
            <div className="flex flex-col items-center justify-center space-y-4">
              <FormLabel className="relative">
                  <Avatar className="w-36 h-36 border-2 cursor-pointer">
                    <AvatarImage
                      src={avatar || user?.avatar}
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
                    {...fileRef}
                    onChange={handlePreview}
                  />
                </FormControl>
                <FormMessage/>
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
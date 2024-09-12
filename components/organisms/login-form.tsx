"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginFormSchema} from "@/lib/schema";
import {z} from "zod";
import {supabase} from "@/lib/supabase/client";
import {toast} from "sonner";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useRouter, useSearchParams} from "next/navigation";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {LoadingIcon} from "@/components/atoms/loading-icon";
import {useAptabase} from "@aptabase/react"

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { trackEvent } = useAptabase();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    setLoading(true);
    const {error, data} = await supabase.auth.signInWithPassword(values);
    if (error) {
      toast.error(error.message);
      trackEvent("login_failed", { error: error.message });
      setLoading(false);
    } else if (data.user && data.user.email_confirmed_at) {
      toast.success("Login successful");
      trackEvent("login_successful");
      const redirectTo = searchParams.get('redirect_to') || '/';
      router.replace(redirectTo);
    } else {
      toast.error("Please confirm your email before logging in.");
      trackEvent("login_unconfirmed_email");
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <FormField
                render={({field}) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
                name="email"
                control={form.control}
              />
              <FormField
                render={({field}) => (
                  <FormItem className="grid gap-2">
                    <div className="flex items-center">
                      <FormLabel> Password</FormLabel>
                      <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                name="password"
                control={form.control}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                <LoadingIcon loading={loading}/>
                {loading ? "Logging in" : "Login"}
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline">
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

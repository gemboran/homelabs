"use client"

import {useRouter, useSearchParams} from "next/navigation"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {supabase} from "@/lib/supabase/client";
import {toast} from "sonner";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {Ban, Loader2} from "lucide-react";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  error: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const isError = searchParams.get('error');

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    }
  });

  useEffect(() => {
    if (isError) setError(searchParams.get('error_description'));
    if (error) {
      toast.error(error);
      form.setError("error", {message: error});
    }
  }, [isError, error]);

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    setLoading(true);
    const {error} = await supabase.auth.updateUser({password: values.password});
    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success("Password reset successful. Please log in with your new password.");
      router.replace("/login");
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter a new password and the confirmation below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <FormField
                render={({field}) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        disabled={loading || !!error}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
                name="password"
                control={form.control}
              />
              <FormField
                render={({field}) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        disabled={loading || !!error}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
                name="confirmPassword"
                control={form.control}
              />
              <Button type="submit" className="w-full" disabled={loading || !!error}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                {error && <Ban className="mr-2 h-4 w-4 text-red-600"/>}
                {loading ? "Resetting Password" : "Reset Password"}
              </Button>
              <FormField render={() => <FormMessage className="w-full text-center"/>} name="error"
                         control={form.control}/>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
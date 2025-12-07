"use client";

import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const signInFormSchema = z.object({
  email: z.email({ message: "Invalid email email address" }),
  password: z.string().min(3, {
    message: "Password us required",
  }),
});

type SignInFormValues = z.infer<typeof signInFormSchema>;

export default function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsloading] = useState(false);
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    try {
      setIsloading(true);
      await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
          callbackURL: "/",
        },
        {
          onSuccess: () => {
            router.push("/");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        }
      );
    } catch (error) {
      console.error({ error });
    } finally {
      setIsloading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in to your Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="cursor-pointer">
              Sign In
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

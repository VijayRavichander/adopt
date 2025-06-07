"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


import { Input } from "@/components/ui/input";

import { BACKEND_URL } from "@/app/config";

// ---------- validation schema ----------
const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  name: z.string().min(1, { message: "Name is required" }),
});


type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();

  // ---------- RHF setup ----------
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", name: "" },
  });

  // ---------- submit handler ----------
  const onSubmit = async (values: LoginValues) => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/auth/login`,
        { name: values.name, email: values.email },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );
      if (res.status === 200) {
        router.push("/search?sort=breed:asc&size=24&from=0");
      } else {
        alert("Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <Card className="min-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage /> 
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input id="name" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          {/* button sits in the CardFooter to preserve your original layout */}
          <CardFooter className="flex-col gap-2 my-3">
            {/* your original “🐶 slide” button kept as-is */}
            <div className="relative group inline-block w-full">
              <button
                type="submit"
                className="w-full bg-blue-400 text-white font-semibold py-2 px-4 rounded-md overflow-hidden"
              >
                <div className="relative h-6">
                  <span className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:translate-x-full">
                    Login
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center transition-transform duration-500 -translate-x-full group-hover:translate-x-0">
                    🐶
                  </span>
                </div>
              </button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

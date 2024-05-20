"use client";

import { useForm } from "react-hook-form";
import { login } from "./actions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.set("email", data.email);
    formData.set("password", data.password);

    await login(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-light">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md p-8 bg-white rounded shadow-md"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email:</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                    className="w-full p-2 mt-1 border border-gray-300 rounded"
                  />
                </FormControl>
                {form.formState.errors.email && (
                  <FormMessage className="text-red-500">
                    {form.formState.errors.email.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password">Password:</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    {...field}
                    className="w-full p-2 mt-1 border border-gray-300 rounded"
                  />
                </FormControl>
                {form.formState.errors.password && (
                  <FormMessage className="text-red-500">
                    {form.formState.errors.password.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-4 bg-black text-white w-full">
            Log in
          </Button>
        </form>
      </Form>
    </div>
  );
}

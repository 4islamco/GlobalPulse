import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

interface NewsletterSignupProps {
  className?: string;
  variant?: "primary" | "secondary" | "dark";
}

export function NewsletterSignup({ className, variant = "primary" }: NewsletterSignupProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // In a real app, we would make an API call here
      // await apiRequest("POST", "/api/newsletter/subscribe", values);
      
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
        variant: "default",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const bgColor = {
    primary: "bg-primary/10",
    secondary: "bg-secondary/10",
    dark: "bg-neutral-darkest",
  };

  const textColor = {
    primary: "text-neutral-dark",
    secondary: "text-neutral-dark",
    dark: "text-white",
  };

  const buttonColor = {
    primary: "bg-primary hover:bg-primary-dark text-white",
    secondary: "bg-secondary hover:bg-secondary-dark text-white",
    dark: "bg-secondary hover:bg-secondary-dark text-white",
  };

  const inputBorder = {
    primary: "border-neutral-light focus:ring-primary/30",
    secondary: "border-neutral-light focus:ring-secondary/30",
    dark: "border-neutral-dark focus:ring-secondary/30 bg-neutral-dark text-white",
  };

  return (
    <div className={`${bgColor[variant]} rounded-lg p-6 ${className}`}>
      <h3 className={`text-xl font-['Playfair_Display'] font-bold mb-3 ${variant === 'dark' ? 'text-white' : ''}`}>
        Stay Updated
      </h3>
      <p className={`${textColor[variant]} mb-4`}>
        Get the latest news delivered to your inbox. Subscribe to our newsletter.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    placeholder="Your email address" 
                    className={`w-full px-4 py-2 rounded-md border ${inputBorder[variant]} focus:outline-none focus:ring-2`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className={`w-full ${buttonColor[variant]} font-medium py-2 rounded-md transition-colors`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

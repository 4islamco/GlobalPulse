import React, { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { insertSubscriberSchema } from '@shared/schema';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Extend the schema with terms acceptance
const subscribeFormSchema = insertSubscriberSchema.extend({
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms to subscribe',
  }),
});

type SubscribeFormValues = z.infer<typeof subscribeFormSchema>;

export const NewsletterSignup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Initialize form with react-hook-form
  const form = useForm<SubscribeFormValues>({
    resolver: zodResolver(subscribeFormSchema),
    defaultValues: {
      name: '',
      email: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: SubscribeFormValues) => {
    setIsLoading(true);
    
    try {
      // Remove acceptTerms as it's not part of the insertSubscriberSchema
      const { acceptTerms, ...subscriberData } = data;
      
      await apiRequest('POST', '/api/subscribe', subscriberData);
      
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
        variant: "default",
      });
      
      form.reset();
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="p-8 md:p-12 md:w-1/2">
              <h2 className="font-headline text-3xl font-bold text-white mb-4">
                Stay Informed with Real World News
              </h2>
              <p className="text-white/80 mb-6">
                Get the latest news, exclusive analysis, and breaking stories delivered straight to your inbox. Sign up for our newsletter today.
              </p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="Full Name" 
                            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Email Address" 
                            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <Label htmlFor="acceptTerms" className="text-white/80 text-sm font-normal">
                            I agree to receive news and updates from REAL WORLD in accordance with the Privacy Policy
                          </Label>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full px-6 py-3 bg-accent text-neutral-500 font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Subscribing...
                      </>
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
            
            <div className="hidden md:block md:w-1/2 relative">
              <div className="absolute inset-0 bg-black/20 z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1495020689067-958852a7765e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="News reporting" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

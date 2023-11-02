"use client"
import { ThreadValidation } from "@/lib/validations/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import  * as z from "zod";
import { createThread } from "@/lib/actions/thread.action";

function PostThread({userId}:{userId:string}){
    const router = useRouter();
    const pathname =  usePathname();
    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues:{
            thread:'',
            accountId:userId,
        }
    });
    const onSubmit = async(values:z.infer<typeof ThreadValidation>)=>{
     await createThread({
        text:values.thread,
        author: userId,
        communityId:null,
        path:pathname
     });
     router.push('/')

    }
    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-3">
                <FormLabel className="text-base-semibold text-light-2">Context</FormLabel>
                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-3">
                  <Textarea 
                    rows={15}  
                    {...field}
                   
                    />
                </FormControl>
                <FormMessage/>
              
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-primary-500">
            Post Thread
          </Button>
            </form>
        </Form>
    );
}
 
export default PostThread;
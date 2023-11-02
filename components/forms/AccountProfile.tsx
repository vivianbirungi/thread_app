"use client"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserValidation } from "@/lib/validations/user";
import { zodResolver } from '@hookform/resolvers/zod';
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";
interface props{
    userD:{
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
    btnTitle: string;
}
const AccountProfile = ({userD,btnTitle}:props ) => {
  const [files, setFiles]= useState <File[]>([])
  const {startUpload} = useUploadThing("media");
  const pathname = usePathname();
  const router = useRouter();
    const form = useForm({
        resolver: zodResolver(UserValidation),
        defaultValues:{
            profile_photo:userD?.image||'',
            name:userD?.name||'',
            username:userD?.username||'',
            bio:userD?.bio||''
        }
    }); 
    const handleImage = (e:ChangeEvent <HTMLInputElement>, fieldChange: (value:string) =>void) => {
        e.preventDefault();
        const fileReader = new FileReader();
        if(e.target.files && e.target.files.length>0){
          const file = e.target.files[0]
          setFiles(Array.from(e.target.files));
          if(!file.type.includes('image')) return;
          fileReader.onload = async(event) =>{
            const imageDataUrl = event.target?.result?.toString() || '';
            fieldChange(imageDataUrl);
          }
          fileReader.readAsDataURL(file);
        }
    }
    const onSubmit =  async(values: z.infer<typeof UserValidation>) =>{
        const blob = values.profile_photo;

        const hasimageChanged = isBase64Image(blob)
        if(hasimageChanged){
          const imgRes = await startUpload(files);
          if(imgRes && imgRes[0].url ){
            values.profile_photo = imgRes[0].url;
          }
        }
        await updateUser({username:values.username,
          name: values.name,
          bio: values.bio, image: values.profile_photo, userId:userD.id, path:pathname});
          if(pathname ==='/profile/edit'){router.back();}
          else{
            router.push('/');
          }
        // todo: update user profile
      }
    
    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
            control={form.control}
            name="profile_photo"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel className="account-form_image-label">
                    {field.value ?(
                        <Image
                        src = {field.value}
                        alt="profile photo"
                        width={96}
                        height={96}
                        priority
                        className="rounded-full object-contain"/>
                        
                        ):(
                            <Image
                            src = "/assets/profile.svg"
                            alt="profile photo"
                            width={24}
                            height={24}
                            className="object-contain"/> 
                        )}
                </FormLabel>
                <FormControl className="flex-1 text-base-semibold text-gray">
                  <Input 
                    type="file"
                    accept="image/*"
                    placeholder="Upload a photo" 
                    className="account-form_image-input"
                    onChange={(e)=>handleImage(e, field.onChange)}
                    />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-3">
                <FormLabel className="text-base-semibold text-light-2">Name</FormLabel>
                <FormControl className="">
                  <Input 
                    type="text"  
                    {...field}
                    className="account-form_input no-focus"
                    />
                </FormControl>
                
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-3">
                <FormLabel className="text-base-semibold text-light-2">username</FormLabel>
                <FormControl className="">
                  <Input 
                    type="text"  
                    {...field}
                    className="account-form_input no-focus"
                    />
                </FormControl>
                <FormMessage/>
                
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-3">
                <FormLabel className="text-base-semibold text-light-2">Bio</FormLabel>
                <FormControl className="">
                  <Textarea 
                    rows={10}  
                    {...field}
                    className="account-form_input no-focus"
                    />
                </FormControl>
                <FormMessage/>
              
              </FormItem>
            )}
          />
          <Button className="bg-primary-500 w-full" type="submit">Submit</Button>
        </form>
      </Form>
    )
}
export default AccountProfile ;
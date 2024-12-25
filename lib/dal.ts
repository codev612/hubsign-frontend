import 'server-only'

import { cache } from 'react';
import { cookies } from 'next/headers'
import { redirect } from "next/navigation";
import { siteConfig } from '@/config/site';
 
export const verifySession = cache(async () => {
  const session = (await cookies()).get('session')?.value;
 
  if (!session) {
    redirect('/signin');
  }
 
  return session;
})

export const getUser = cache(async () => {
    const session = await verifySession();
    if (!session) return null;
    
    try {
        const response = await fetch(`${siteConfig.links.server}/auth/profile`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${session}`, // Attach token to Authorization header
            },
        });
            
        const json = await response.json();
    
        if(!response.ok) {
            redirect("/signin");
        }
    
        return json;
    } catch (error) {
        console.log(error);
        return null;
    }
    
})
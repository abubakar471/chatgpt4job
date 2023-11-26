"use client"

import supabase from '@/config/supabaseClient'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

export default async function Home() {
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("user : ", user);

      if (user) {
        router.push("/chat");
      }
    }

    fetchUser();
  }, [])

  return (
    <div className='w-full flex'>
      <div className='w-7/12 px-10 py-4'>
        <nav className="">
          <div className="text-[28px]">
            ChatGPT<span className="font-semibold text-orange-500">4Job</span>
          </div>
        </nav>

        <div className='mt-40'>
          <h3 className='text-[40px] text-orange-500'>Ask for any information & get the most accurate answer for your prompt...</h3>
        </div>
      </div>

      <div className='w-5/12 min-h-screen bg-[#333] flex flex-col'>
        <div className='flex-grow flex items-center justify-center gap-x-4'>

          <Link href="/sign-in" className='px-10 py-4 bg-blue-500 text-white rounded-md text-[20px]'>Sign In</Link>
          <Link href="/sign-up" className='px-10 py-4 bg-blue-500 text-white rounded-md text-[20px]'>Sign Up</Link>
        </div>

        <div className='w-full flex flex-col items-center justify-center gap-x-4 pb-10 text-gray-200'>
          <div className='text-[20px]'>
            MindCase
          </div>
          <div className='w-full flex items-center justify-center gap-x-4 text-gray-200'>
            <Link href='/terms-service' className='hover:underline'>Terms of Use</Link>
            <Link href='/privacy-policy' className='hover:underline'>Privacy & Policy</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

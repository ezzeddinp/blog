import React from 'react'
import SignInBtn from '@/components/SignInBtn'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function page() {
  const session = await getServerSession(authOptions);

  // route protection
  // so that ppl cant use URL injection to search folder
  // itll redirect to sign in first
  if (session) {
    redirect("/dashboard");
  }

  return (
    <SignInBtn />
  )
}

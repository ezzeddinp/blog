import CreatePostForm from '@/components/CreatePostForm'
import React from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function CreatePost() {
	const session = await getServerSession(authOptions);

	// route protection
	// so that ppl cant use URL injection to search folder
	// itll redirect to sign in first
	if (!session){
		redirect("/sign-in");
	}

	return (
		<CreatePostForm />
	)
}

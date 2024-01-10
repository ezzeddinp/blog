import React from 'react'
import Post from '@/components/Post'
import Link from 'next/link'

import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { TPost } from '../types'

const getPosts = async (email: string) => {
	try {
		const res = await fetch(`${process.env.NEXTAUTH_URL}/api/authors/${email}`);
		const { posts } = await res.json();
		return posts;
	} catch (error) {
		console.log(error);
	}
}

export default async function page() {
	const session = await getServerSession(authOptions);
	const email = session?.user?.email;
	let posts = [];

	// route protection
	// so that ppl cant use URL injection to search folder
	// itll redirect to sign in first
	if (!session) {
		redirect("/sign-in");
	}

	if (email) {
		posts = await getPosts(email);
	}

	return (
		<div>
			<h1>My Posts</h1>

			{posts && posts.length > 0 ? (
				posts.map((post: TPost) => (
					<Post
						key={post.id}
						id={post.id}
						author={""}
						authorEmail={post.authorEmail}
						date={post.createdAt}
						thumbnail={post.imageUrl}
						category={post.catName}
						title={post.title}
						content={post.content}
						links={post.links || []}
					/>
				))
			) : (
				<div className='py-6'>
					<div>No posts created yet.</div>
					<Link className='underline' href={"/create-post"}>Create New</Link>
				</div>
			)}
		</div>
	)
}

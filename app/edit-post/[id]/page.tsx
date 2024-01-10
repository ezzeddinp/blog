import EditPostForm from '@/components/EditPostForm'
import React from 'react'
import { TPost } from '@/app/types'
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

const getPost = async (id: string): Promise<TPost | null> => {
    try {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts/${id}`, {
            cache: "no-store",
        });

        if (res.ok) {
            const post = await res.json();
            return post;
        }
    } catch (error) {
        console.log(error);
    }

    return null;
}

export default async function EditPost({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    // route protection
    // so that ppl cant use URL injection to search folder
    // itll redirect to sign in first
    if (!session) {
        redirect("/sign-in");
    }

    const id = params.id;
    const post = await getPost(id);

    return (
        <>
            {post ? <EditPostForm post={post}/> : <div>Invalid Post</div>}
        </>
    )
}

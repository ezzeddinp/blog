"use client"

import React, { useEffect } from 'react'
import { useState } from 'react';
import DeleteBtn from './DeleteBtn';
import { TCategory } from '@/app/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function CreatePostForm() {
    const [links, setLinks] = useState<string[]>([]);
    const [linkInput, setLinkInput] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categories, setCategories] = useState<TCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [publicId, setPublicId] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    useEffect(() => {
        const fetchAllCategories = async () => {
            const res = await fetch("api/categories");
            const catNames = await res.json();
            setCategories(catNames);
        }

        fetchAllCategories();
    }, [])

    const addLink = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (linkInput.trim() !== "") {
            setLinks((prev) => [...prev, linkInput]);
            setLinkInput("");
        }
    }

    // delete logic
    const deleteLink = (index: number) => {
        setLinks((prev) => prev.filter((_, i) => i !== index)); // if index is equal to i then delete
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // to prevent the default behavior which is reloading the page

        if (!title || !content) {
            setError("Title and Content are required!");
            return;
        }

        try {
            const res = await fetch('api/posts/', {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    title, content, links, selectedCategory, imageUrl, publicId
                }),
            });

            if (res.ok) {
                router.push('/dashboard') // redirecting to dashboard after posted
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h2>Create Post</h2>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
                <input
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    placeholder='Title'
                />
                <textarea
                    onChange={(e) => setContent(e.target.value)}
                    placeholder='Content'
                ></textarea>

                {
                    links && links.map((link, i) =>
                        <div key={i} className='flex items-center gap-4'>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                </svg>

                            </span>
                            <Link className='link' href={link}>

                                {link}
                            </Link>
                            <span className='cursor-pointer' onClick={() => deleteLink(i)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" clipRule="evenodd" />
                                </svg>

                            </span>
                        </div>)
                }

                <div className='flex gap-2'>
                    <input
                        className='flex-1 '
                        type="text"
                        placeholder='Paste the link and click on Add'
                        onChange={(e) => setLinkInput(e.target.value)}
                        value={linkInput}
                    />
                    <button onClick={addLink} className='btn flex gap-2 items-center'>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                            </svg>
                        </span>
                        Add
                    </button>
                </div>

                <select
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className='p-3 rounded-md border appearance-none'
                >
                    <option value="">Select a Category</option>
                    {
                        categories && categories.map((category) => (
                            <option key={category.id} value={category.catName}>
                                {category.catName}
                            </option>
                        ))}
                </select>

                <button type='submit' className='primary-btn'>
                    Create Post
                </button>

                {error && <div className='p-2 text-red-500 font-bold'>
                    {error}
                </div>}
            </form>
        </div>
    )
}

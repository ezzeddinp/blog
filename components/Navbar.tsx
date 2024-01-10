'use client';

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image';

export default function Navbar() {
	const { status, data: session } = useSession();
	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const popupRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
				setIsPopupVisible(false);
			}
		};

		document.addEventListener("click", handleClickOutside);

		if (!isPopupVisible){
			document.removeEventListener("click", handleClickOutside);
		}

		return () => {
			document.removeEventListener("click", handleClickOutside);
		}

	}, [isPopupVisible]);

	return (
		<div className='flex justify-between pb-4 border-b mb-4 relative'>
			<div>
				<Link href={"/"}>
					<h1 className='text-dark text-4xl font-bold tracking-tighter'>Tech News</h1>
				</Link>
				<p className='text-sm'>
					Exploring Tomorrow&apos;s Innovations.
				</p>
			</div>

			{
				status === 'authenticated' ? (
					<>
						<div ref={popupRef} className={`absolute z-30 right-0 top-20 bg-white p-6 shadow-lg rounded-md flex-col gap-2 text-right min-w-[160px] items-center text-sm ${isPopupVisible ? 'flex' : 'hidden'}`}>
							<div className='font-bold'>
								{
									session?.user?.name
								}
							</div>
							<div>
								{
									session?.user?.email
								}
							</div>
							<Link onClick={() => setIsPopupVisible(false)} className='hover:underline' href={"/dashboard"}>Dashboard</Link>
							<Link onClick={() => setIsPopupVisible(false)} className='hover:underline' href={"/create-post"}>Create Post</Link>
							<button onClick={() => signOut()} className='btn'>
								Sign Out
							</button>
						</div>

						<div className='flex gap-2 items-center'>
							<Link className='hidden md:flex gap-2 items-center mr-6' href={"/create-post"}>
								<span>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
										<path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
									</svg>

								</span>
								<span>Create New</span>
							</Link>
							<Image
								className='rounded-full cursor-pointer'
								src={session?.user?.image || ""}
								width={36}
								height={36}
								alt='Profile Image'
								onClick={() => setIsPopupVisible((prev) => !prev)}
							/>
						</div>
					</>
				) : (

					<div className='flex items-center text-sm'>
						<Link className='btn' href={"/sign-in"}>
							Sign In
						</Link>
					</div>
				)
			}
		</div>
	)
}

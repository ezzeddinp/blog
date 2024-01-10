"use client";

export default function DeleteBtn({ id }: { id: string }) {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are u sure want to dlete this post?"
    );

    if (confirmed) {
      try {
        const res = await fetch(`/api/posts/${id}`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
          }
        });

        if (res.ok) {
          console.log("Post deleted");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <button onClick={handleDelete} className='text-red-600'>
      Delete
    </button>
  )
}

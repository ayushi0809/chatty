"use client";
import { FC, useState } from "react";
import Button from "./ui/Button";
import { addFreindValidator } from "@/lib/validation/add-friend";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
interface AddFriendButtonProps {}

type FormData = z.infer<typeof addFreindValidator>;

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const [showSuccessState, setshowSuccessState] = useState<boolean>(false);
  const { register, handleSubmit, setError, formState : {errors} } = useForm<FormData>({
    resolver: zodResolver(addFreindValidator),
  });
  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFreindValidator.parse({ email });
      await axios.post("/api/friends/add", {
        email: validatedEmail,
      });
      setshowSuccessState(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("email", { message: error.message });
      }
      if (error instanceof AxiosError) {
        setError("email", { message: error.response?.data });
        return;
      }
      setError("email", { message: "something went wrong" });
    }
  };
  const onSubmit = (data: FormData) => {
    addFriend(data.email);
  };
  return (
    <div className='flex items-center justify-center'>
<div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
  <h2 className="text-xl font-semibold mb-4">Add a Friend</h2>
  <form onSubmit={handleSubmit(onSubmit)}>
    <div className="mb-4">
      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 leading-6">Add Friend by email</label>
      <input {...register("email")} type="text"  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="you@example.com"  />
    </div>
    <Button>Add</Button>
       <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      {showSuccessState && <p className="mt-1 text-sm text-green-600">Friend added!!</p>}
  </form>
</div>
</div>

    
  );
};

export default AddFriendButton;

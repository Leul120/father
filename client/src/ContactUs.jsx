import React, {  useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { message } from 'antd';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm();

 

  const submitData = async (data) => {
    try {
      setLoading(true);
      console.log(data)
      const response=await axios.post(`${apiUrl}/contact-us`, data);
      setLoading(false);
      console.log(response.data)
      message.success("Message sent successfully!");
      reset(); // Reset form after successful submission
    } catch (err) {
      console.error(err);
      setLoading(false);
      message.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className='flex items-center justify-center w-full min-h-screen inset-0 bg-gradient-to-b from-blue-900 to-black opacity-90'>
      <div className='p-12 bg-white/10 backdrop-blur-2xl rounded-xl shadow-lg max-w-md w-full'>
        <h1 className='text-3xl font-bold text-center text-sky-500 mb-6'>Contact Me</h1>
        <form onSubmit={handleSubmit(submitData)} className='space-y-5'>
          <div className='flex gap-4'>
            <Controller
              name='firstName'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  className={`w-full border-b-2 bg-transparent border-gray-400  px-3 py-2 focus:outline-none focus:border-purple-400 ${errors.firstName ? 'border-red-500' : ''}`}
                  placeholder='First Name'
                  {...field}
                />
              )}
            />
            <Controller
              name='lastName'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  className={`w-full border-b-2 bg-transparent border-gray-400 px-3 py-2  focus:outline-none focus:border-purple-400 ${errors.lastName ? 'border-red-500' : ''}`}
                  placeholder='Last Name'
                  {...field}
                />
              )}
            />
          </div>
          <Controller
            name='email'
            control={control}
            rules={{ required: true, pattern: /^\S+@\S+$/i }}
            render={({ field }) => (
              <input
                className={`w-full border-b-2 bg-transparent border-gray-400  px-3 py-2 focus:outline-none focus:border-purple-400 ${errors.email ? 'border-red-500' : ''}`}
                placeholder='Email'
                {...field}
              />
            )}
          />
          <Controller
            name='phoneNumber'
            control={control}
            rules={{ required: true, pattern: /^\d+$/ }}
            render={({ field }) => (
              <input
                className={`w-full border-b-2 bg-transparent border-gray-400  px-3 py-2  focus:outline-none focus:border-purple-400 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                placeholder='Phone Number'
                {...field}
              />
            )}
          />
          <Controller
            name='description'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <textarea
                className={`w-full border-2 bg-transparent border-gray-400 rounded-lg px-3 py-2 h-44  focus:outline-none focus:border-purple-400 ${errors.description ? 'border-red-500' : ''}`}
                placeholder='Description'
                {...field}
              />
            )}
          />
          <button
            type='submit'
            className={`w-full h-10 rounded-full flex items-center justify-center transition duration-300 ease-in-out  ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-700 hover:bg-purple-600'}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingOutlined className='mr-2 animate-spin' /> Sending...
              </>
            ) : (
              "Send"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;


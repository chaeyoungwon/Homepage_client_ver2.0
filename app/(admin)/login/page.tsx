'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import bg_logo from '@/public/image/admin/bg_KAHLUA.svg';
import { axiosInstance } from '@/api/auth/axios';
import { useRouter } from 'next/navigation';

const page = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post(
        '/auth/sign-in',
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);

      if (
        response.data.isSuccess === true &&
        response.data.result.role === 'ADMIN'
      ) {
        localStorage.setItem('access_token', response.data.result.accessToken);
        localStorage.setItem(
          'refresh_token',
          response.data.result.refreshToken
        );
        router.push('/admin/ticketing');
      } else {
        alert('아이디 또는 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      alert('다시 로그인 해주세요.');
      console.error(error);
    }
  };

  return (
    <div className="font-pretendard w-full h-full flex justify-center">
      <div className="flex flex-col gap-10 items-center mt-[185px]">
        <div className="w-[792px] h-[484px] rounded-xl">
          <div className="bg-gray-90 h-[160px] relative z-0 rounded-t-xl">
            <Image
              src={bg_logo}
              alt="bg-logo"
              height={136}
              className="opacity-50 fill-gray-0 absolute top-[43px] z-10"
            />
            <p className="font-mustica absolute top-[37px] left-[299px] text-center text-[64px] font-semibold text-gray-0">
              Admin
            </p>
          </div>
          <div className="font-pretendard w-full h-[324px] flex flex-col items-center justify-center border-solid border-[1px] border-gray-15 rounded-b-xl">
            <form>
              <div className="mb-[40px] flex flex-col gap-2">
                <span className="text-xl font-semibold text-gray-90">ID</span>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleEmail}
                  placeholder="ID를 입력해주세요."
                  className="w-[588px] h-12 rounded-xl border-solid border-[1px] border-gray-15 pl-4 placeholder:text-base placeholder:text-gray-20 placeholder:font-normal"
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xl font-semibold text-gray-90">
                  비밀번호
                </span>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handlePassword}
                  placeholder="비밀번호를 입력해주세요."
                  className="w-[588px] h-12 rounded-xl border-solid border-[1px] border-gray-15 pl-4 placeholder:text-base placeholder:text-gray-20 placeholder:font-normal"
                />
              </div>
            </form>
          </div>
        </div>
        <div
          className="w-[384px] h-[59px] bg-gray-5 rounded-xl flex justify-center items-center cursor-pointer"
          onClick={handleLogin}
        >
          <span className="font-pretendard text-gray-60 text-center text-lg font-medium">
            로그인
          </span>
        </div>
      </div>
    </div>
  );
};

export default page;

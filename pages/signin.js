import { getSession, signIn } from 'next-auth/react';
import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';

import { getUserByEmail } from '../utils/backend/getUser';
import { addToCollection } from '../utils/backend/insertDocument';
import { AccountSettings } from '../components/AccountSettings';

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

import Image from 'next/image';
import { route } from 'next/dist/server/router';
import { useRouter } from 'next/router';

const SignInSection = ({ router }) => {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });
  const onSignInClick = async () => {
    if (loginInfo.email.length === 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Email is required!',
      });
    }
    if (loginInfo.password.length === 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords is empty!',
      });
    }
    await signIn('credentials', {
      redirect: false,
      email: loginInfo.email,
      password: loginInfo.password,
    }).then(({ ok, error }) => {
      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong, check your credential!',
        });
      } else {
        router.push('/');
      }
    });
  };
  return (
    <>
      <div className='mx-5 flex flex-col justify-center items-center'>
        <div className='flex flex-col w-[30%] mt-5 gap-2'>
          <input
            placeholder='Email'
            type='email'
            className='rounded'
            onChange={(e) =>
              setLoginInfo({ ...loginInfo, email: e.target.value })
            }
          />
          <input
            placeholder='Password'
            type='password'
            className='rounded'
            onChange={(e) =>
              setLoginInfo({ ...loginInfo, password: e.target.value })
            }
          />
          <button
            className='rounded p-2 flex justify-center items-center gap-2 bg-bsBlue hover:bg-blue-500 text-white'
            onClick={onSignInClick}
          >
            Sign In{' '}
          </button>{' '}
        </div>
        <button className='rounded p-2 flex w-[30%] justify-center items-center gap-2 bg-cyan-900 hover:bg-cyan-800 text-white mt-2'>
          <Image
            src='/assets/icon/icons8-google.svg'
            height={20}
            width={20}
            alt='googleIcon'
          />{' '}
          Sign In with Google
        </button>
      </div>
    </>
  );
};

export default function RegisterPage({ pageProps }) {
  const { session } = pageProps;
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Binary Search - Sign In</title>
      </Head>
      <Navbar signedIn={session} />
      <h1 className='text-center text-3xl mt-4'>Sign In</h1>
      {session && <AccountSettings session={session.user} />}
      {!session && <SignInSection router={router} />}
    </>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession(context);

  const userEmail = session?.user?.email;
  const user = userEmail !== undefined ? await getUserByEmail(userEmail) : null;
  if (user) {
    return {
      redirect: {
        destination: '/profile',
        permanent: false,
      },
    };
  }
  return {
    props: { pageProps: { session } },
  };
}

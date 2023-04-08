import useInput from '@hooks/useInput';
import { Button, Error, Form, Header, Input, Label, LinkContainer } from '@pages/SignUp/styles';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';

const WorkSpace: FC = ({ children }) => {
  // children이 있는 타입 : FC
  const { data, mutate } = useSWR('/api/users', fetcher);

  const onLogout = useCallback(() => {
    axios
      .post('/api/users/logout', {
        withCredentials: true,
      })
      .then(() => {
        mutate(false, false);
      })
      .catch((error) => {
        console.log(error.response?.data);
      });
  }, []);

  if (!data) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <button onClick={onLogout}>로그아웃하기</button>
      {children}
    </div>
  );
};

export default WorkSpace;

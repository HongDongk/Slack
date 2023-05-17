import WorkSpace from '@layouts/Workspace';
import axios from 'axios';
import { Redirect, Link, useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import gravatar from 'gravatar';
import useSWR from 'swr';
import { IUser } from '@typings/db';
import { Header } from '@pages/DirectMessage/styles';
import fetcher from '@utils/fetcher';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR<IUser | false>(`/api/workspaces/${workspace}/users/${id}`, fetcher);

  if (!userData) {
    return <div>없는 사용자입니다!!</div>;
  }

  return (
    <WorkSpace>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>&nbsp;&nbsp;{userData.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox chat="" />
    </WorkSpace>
  );
};

export default DirectMessage;

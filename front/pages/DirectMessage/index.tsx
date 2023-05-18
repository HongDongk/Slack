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
import useInput from '@hooks/useInput';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData, mutate } = useSWR<IUser | false>(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const [chat, onChangeChat, setChat] = useInput('');

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then(() => {
            mutate();
            setChat('');
          })
          .catch(console.error);
      }
    },
    [chat, userData, workspace, id],
  );

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
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} placeholder="메세지를 입력하세요" />
    </WorkSpace>
  );
};

export default DirectMessage;

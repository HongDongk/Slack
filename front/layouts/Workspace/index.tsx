import gravatar from 'gravatar';
import {
  Header,
  RightMenu,
  ProfileImg,
  WorkspaceWrapper,
  Workspaces,
  WorkspaceName,
  Channels,
  Chats,
  MenuScroll,
} from '@layouts/Workspace/styles';
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
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.email} />{' '}
            {/*아바타아이콘생성*/}
          </span>
          <button onClick={onLogout}>로그아웃</button>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Slack</WorkspaceName>
          <MenuScroll>scroll</MenuScroll>
        </Channels>
        <Chats>Chats</Chats>
      </WorkspaceWrapper>
      {children}
    </div>
  );
};

export default WorkSpace;

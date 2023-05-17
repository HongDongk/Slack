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
  ProfileModal,
  LogOutButton,
  WorkspaceButton,
  AddButton,
  WorkspaceModal,
} from '@layouts/Workspace/styles';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import { Redirect, Link, useParams } from 'react-router-dom';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import Menu from '@components/Menu';
import { IUser, IChannel } from '@typings/db';
import ChannelList from '@components/ChannelList';
import DMList from '@components/DMList';
import CreateWorkSpaceModal from '@components/CreateWorkSpaceModal';
import CreateChannelModal from '@components/CreateChannelModal';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';

const WorkSpace: FC = ({ children }) => {
  // children이 없는 타입 : FC

  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData, mutate } = useSWR<IUser | false>('/api/users', fetcher); // 유저데이터가져오기

  const [showUserMenu, setShowUserMenu] = useState(false); // 유저메뉴 보이기
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false); // 워크스페이스 생성모달
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false); // 현재 워크 스페이스보이기
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false); // 채널 생성모달
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false); // 워크스페이스 사용자초대모달

  const onLogout = useCallback(() => {
    axios
      .post('/api/users/logout', {
        withCredentials: true,
      })
      .then(() => {
        mutate();
      })
      .catch((error) => {
        console.log(error.response?.data);
      });
  }, []);

  const onClickUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteWorkspaceModal(false);
  }, []);

  if (!userData) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.email} />{' '}
            {/*아바타아이콘생성*/}
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces?.map((a) => {
            return (
              <Link key={a.id} to={`/workspace/${a.url}/channel/일반`}>
                <WorkspaceButton>{a.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>{workspace}</WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>{workspace} WorkSpace</h2>
                <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                <button onClick={onClickAddChannel}>채널 만들기</button>
              </WorkspaceModal>
            </Menu>
            <ChannelList />
            <DMList />
          </MenuScroll>
        </Channels>
        <Chats>{children}</Chats>
      </WorkspaceWrapper>
      <CreateWorkSpaceModal
        show={showCreateWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowCreateWorkspaceModal={setShowCreateWorkspaceModal}
      />
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
        toggleWorkspaceModal={toggleWorkspaceModal}
      />
      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
        toggleWorkspaceModal={toggleWorkspaceModal}
      />
    </div>
  );
};

export default WorkSpace;

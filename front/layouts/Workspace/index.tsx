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
import { Redirect, Link } from 'react-router-dom';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import Menu from '@components/Menu';
import { IUser } from '@typings/db';
import CreateWorkSpaceModal from '@components/CreateWorkSpaceModal';
import CreateChannelModal from '@components/CreateChannelModal';

const WorkSpace: FC = ({ children }) => {
  // children이 없는 타입 : FC
  const { data, mutate } = useSWR<IUser | false>('/api/users', fetcher);

  const [showUserMenu, setShowUserMenu] = useState(false); // 유저메뉴 보이기
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false); // 워크스페이스 생성모달
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false); // 현재 워크 스페이스보이기
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false); // 채널 생성모달

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

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowWorkspaceModal(false);
    setShowCreateChannelModal(false);
  }, []);

  if (!data) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.email} />{' '}
            {/*아바타아이콘생성*/}
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(data.email, { s: '36px', d: 'retro' })} alt={data.nickname} />
                  <div>
                    <span id="profile-name">{data.nickname}</span>
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
          {data?.Workspaces?.map((a) => {
            return (
              <Link key={a.id} to={'/workspace/channel/일반'}>
                <WorkspaceButton>{a.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>Slack</WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>Slack</h2>
                {/* <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button> */}
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
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
      />
    </div>
  );
};

export default WorkSpace;

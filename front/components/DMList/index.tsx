import { CollapseButton, Title, Content } from '@components/DMList/styles';
// import useSocket from '@hooks/useSocket';
import { IUser, IUserWithOnline } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import useSWR from 'swr';

const DMList: FC = () => {
  const { workspace } = useParams<{ workspace?: string }>();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );
  //   const [socket] = useSocket(workspace);
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  useEffect(() => {
    console.log('DMList: workspace 바꼈다', workspace);
    setOnlineList([]);
  }, [workspace]);

  //   useEffect(() => {
  //     socket?.on('onlineList', (data: number[]) => {
  //       setOnlineList(data);
  //     });
  //     // socket?.on('dm', onMessage);
  //     // console.log('socket on dm', socket?.hasListeners('dm'), socket);
  //     return () => {
  //       // socket?.off('dm', onMessage);
  //       // console.log('socket off dm', socket?.hasListeners('dm'));
  //       socket?.off('onlineList');
  //     };
  //   }, [socket]);

  return (
    <>
      <Title>
        <CollapseButton onClick={toggleChannelCollapse}>{!channelCollapse ? '🌟' : '⭐'}</CollapseButton>
        <span>Direct Messages</span>
      </Title>
      <Content>
        {!channelCollapse &&
          memberData?.map((member) => {
            return (
              <NavLink key={member.id} activeClassName="selected" to={`/workspace/${workspace}/dm/${member.id}`}>
                <div>{member.nickname}</div>
                {member.id === userData?.id && <span> (나)</span>}
              </NavLink>
            );
          })}
      </Content>
    </>
  );
};

export default DMList;

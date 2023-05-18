import WorkSpace from '@layouts/Workspace';
import axios from 'axios';
import { Redirect, Link, useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import gravatar from 'gravatar';
import useSWR from 'swr';
import { IChannel, IUser } from '@typings/db';
import { Header } from '@pages/DirectMessage/styles';
import fetcher from '@utils/fetcher';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';

const Channel = () => {
  const { channel } = useParams<{ channel?: string }>();

  return (
    <WorkSpace>
      <div># {channel}</div>
    </WorkSpace>
  );
};

export default Channel;

import { ChatArea, MentionsTextarea, Form, SendButton, Toolbox } from '@components/ChatBox/styles';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { useCallback, useEffect, useRef, VFC } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import gravatar from 'gravatar';

interface Props {
  chat: string;
}
const ChatBox: VFC<Props> = ({ chat }) => {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData, mutate } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: memberData } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);

  return (
    <ChatArea>
      <Form>
        <MentionsTextarea id="editor-chat">
          <textarea />
        </MentionsTextarea>
        <Toolbox>
          <SendButton type="submit" disabled={!chat?.trim()}>
            보내기 🚀
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;

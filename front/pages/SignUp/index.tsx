import { Button, Error, Form, Header, Input, Label, LinkContainer } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import React, { useCallback, useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import Loading from '@components/Loading';

const SignUp = () => {
  const { data } = useSWR('/api/users', fetcher);

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [passwordCheck, setPasswordCheck] = useState('');

  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [mismatchError, setMismatchError] = useState(false);

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMismatchError(password !== e.target.value);
    },
    [password],
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!nickname || !email || !password || mismatchError) {
        window.alert('정보를 입력해주세요');
        return;
      }
      setSignUpError('');
      setSignUpSuccess(false); // 비동기통신할때 usestate쓸경우 함수안에 초기값 설정해주기!
      axios
        .post('/api/users', { email, nickname, password })
        .then(() => {
          window.alert('회원가입 성공');
          setSignUpSuccess(true);
        })
        .catch((error) => {
          setSignUpError(error.response?.data);
        });
    },
    [email, nickname, password, mismatchError],
  );

  if (data === undefined) {
    return <Loading />;
  }

  if (data) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      {signUpSuccess && <Redirect to="/login" />}
      <Header>Slack</Header>
      <Form onSubmit={onSubmit}>
        <Label>
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label>
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label>
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label>
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;

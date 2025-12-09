import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import '../authConfig';

type Props = {
  children: React.ReactNode;
};

export default function LoginWrapper({ children }: Props) {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
              padding: 8,
            }}
          >
            <span style={{ alignSelf: 'center' }}>{user?.username}</span>
            <button onClick={() => signOut?.()}>Sign out</button>
          </div>
          <div>{children}</div>
        </div>
      )}
    </Authenticator>
  );
}

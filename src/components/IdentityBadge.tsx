import React from 'react';
import Avatar from './Avatar';
import useStore from '../lib/store';

const IdentityBadge = () => {
  const { authUser } = useStore();

  return (
    <div className="h-[300px] w-full max-w-[800px] sm:min-w-[400px] screen-xxl:max-w-[400px] card mt-16">
      <div className="h-full w-full flex flex-col items-center">
        <div className="w-full h-36 flex justify-center items-center gap-5">
          <div
            className={`h-20 ${
              authUser?.username
                ? 'w-40'
                : 'w-20 border-2 rounded-[50%] text-black'
            } flex justify-center items-center`}
          >
            <Avatar
              type="user"
              seed={authUser?.username}
              bigger={true}
              rounded={true}
            />
          </div>
        </div>
        <p className="text-xl mb-5">{authUser?.username}</p>
        <p className="text-xl">{authUser?.teams_email}</p>
      </div>
    </div>
  );
};

export default IdentityBadge;

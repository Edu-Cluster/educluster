import React, { useState } from 'react';
import MemberComponent from './Member';
import { Member } from '../../lib/types';
import { MoonLoader } from 'react-spinners';

type Props = {
  members: Member[][];
  isOnInvitationPage?: boolean;
};

const MemberList = ({ members, isOnInvitationPage }: Props) => {
  const [page, setPage] = useState(1);

  const loadNewPage = (e: any) => {
    const nextPage = e.target.innerText;

    if (nextPage === page) return;

    setPage(nextPage);
  };

  if (!members) {
    return (
      <div className="h-fit w-full mt-8 border-2 border-sky-50">
        <p className="px-4 rounded-sm bg-gray-100 text-2xl">
          {isOnInvitationPage ? 'Mitglieder zum Einladen' : 'Mitglieder'}
        </p>
        <div className="h-[500px] w-full flex justify-center items-center">
          <MoonLoader size={50} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-[700px] w-full max-w-[800px] mt-8">
      <p className="px-4 rounded-sm bg-gray-100 text-2xl">
        {isOnInvitationPage ? 'Mitglieder zum Einladen' : 'Mitglieder'}
      </p>
      <div className="h-full w-full overflow-y-auto card flex flex-col justify-between divide-y">
        <div className="h-fit divide-y">
          {members && members.length ? (
            members[page - 1].map(({ username, isAdmin, isMe }, idx) => (
              <MemberComponent
                key={idx}
                username={username}
                isOnInvitationPage={isOnInvitationPage}
                showMinusButton={isOnInvitationPage}
                isAdmin={isAdmin}
                isMe={isMe}
              />
            ))
          ) : (
            <></>
          )}
        </div>

        <div className="py-3 flex justify-center items-center gap-2">
          {members && members.length ? (
            members.map((item, idx) => (
              <div
                key={idx + 1}
                className={`${page == idx + 1 ? 'text-white bg-blue-400' : ''}
                  w-6 h-6 rounded-sm text-gray-700 hover:text-white hover:bg-blue-400 slow-animate flex justify-center items-center cursor-pointer text-md`}
                onClick={loadNewPage}
              >
                {idx + 1}
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberList;

import React, { useState } from 'react';
import { Member } from '../../lib/types';
import MemberComponent from '../Member/Member';

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

  return (
    <div className="h-[700px] w-full max-w-[800px] mt-8">
      <p className="px-4 rounded-sm bg-gray-100 text-2xl">
        {isOnInvitationPage ? 'Mitglieder zum Einladen' : 'Mitglieder'}
      </p>
      <div className="h-full w-full overflow-y-auto card flex flex-col justify-between divide-y">
        <div className="h-fit divide-y">
          {members.length ? (
            members[page - 1].map(({ username, role }, idx) => (
              <MemberComponent
                key={idx}
                username={username}
                role={role}
                isOnInvitationPage={isOnInvitationPage}
                showMinusButton={isOnInvitationPage}
              />
            ))
          ) : (
            <></>
          )}
        </div>

        <div className="py-3 flex justify-center items-center gap-2">
          {members.length ? (
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

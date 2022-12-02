import React, { useState } from 'react';
import { Member } from '../../lib/types';
import MemberButtonGroup from './MemberButtonGroup';
import Avatar from '../Avatar';

type Props = {
  members: Member[][];
};

const MemberList = ({ members }: Props) => {
  const [page, setPage] = useState(1);

  const loadNewPage = (e: any) => {
    const nextPage = e.target.innerText;

    if (nextPage === page) return;

    setPage(nextPage);
  };

  return (
    <div className="h-[700px] w-full max-w-[800px] mt-8">
      <p className="px-4 rounded-sm bg-gray-100 text-2xl">Mitglieder</p>
      <div className="h-full w-full overflow-y-auto card flex flex-col justify-between divide-y">
        <div className="h-fit divide-y">
          {members[page - 1].map(({ username, role }, idx) => (
            <div
              className="flex justify-between items-center py-1 px-4 hover:bg-gray-100 fast-animate"
              key={idx}
            >
              <div className="flex items-center">
                <Avatar type="user" seed={username} />
                <div className="flex flex-col items-center ml-12">
                  <p>{username}</p>
                  <p className="text-sm">{role}</p>
                </div>
              </div>
              <MemberButtonGroup />
            </div>
          ))}
        </div>

        <div className="py-3 flex justify-center items-center gap-2">
          {members.map((item, idx) => (
            <div
              key={idx + 1}
              className={`${page == idx + 1 ? 'text-white bg-blue-400' : ''}
                  w-6 h-6 rounded-sm text-gray-700 hover:text-white hover:bg-blue-400 slow-animate flex justify-center items-center cursor-pointer text-md`}
              onClick={loadNewPage}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberList;

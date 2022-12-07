import React, { useState } from 'react';
import ListItem from './Item';
import Tag from './Tag';
import type { Item } from '../../lib/types';

type Props = {
  items: Item[][] | null;
  title?: 'Lerneinheiten' | 'Cluster';
};

const ItemList = ({ items, title }: Props) => {
  const [page, setPage] = useState(1);

  const loadNewPage = (e: any) => {
    const nextPage = e.target.innerText;

    if (nextPage === page) return;

    setPage(nextPage);
  };

  return (
    <div className="h-[700px] w-full max-w-[800px] mt-8">
      {title ? (
        <p className="px-4 rounded-sm bg-gray-100 text-2xl">{title}</p>
      ) : (
        <></>
      )}
      <div className="h-full w-full overflow-y-auto card flex flex-col justify-between divide-y">
        <div className="h-fit divide-y">
          {items &&
            items[page - 1].map((item, idx) => (
              <ListItem
                key={idx}
                type={item.type}
                title={item.title}
                description={item.description}
                host={item.host}
                room={item.room}
                link={item.link}
              >
                {item.type?.category &&
                  item.tags &&
                  item.tags.map((tag, idx) => <Tag key={idx} name={tag} />)}
              </ListItem>
            ))}
        </div>
        <div className="py-3 flex justify-center items-center gap-2">
          {items &&
            items.map((item, idx) => (
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

export default ItemList;

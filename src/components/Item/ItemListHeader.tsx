import React from 'react';

type Props = {
  title: string;
};

const ItemListHeader = ({ title }: Props) => {
  return (
    <p className="px-4 rounded-sm bg-gray-100 dark:bg-gray-800 text-2xl">
      {title}
    </p>
  );
};

export default ItemListHeader;

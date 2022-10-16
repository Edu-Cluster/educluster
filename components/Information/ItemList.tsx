import React from 'react';
import ListItem from '../Information/Item';
import Tag from '../Information/Tag';
import { Item } from '../types';

type Props = {
  items: Item[];
};

// TODO create tags with different colors for cluster/learning-unit

const ItemList = (props: Props) => {
  return (
    <div className="h-full w-full divide-y">
      {props.items.map((item, idx) => (
        <ListItem
          key={idx}
          type={item.type}
          title={item.title}
          description={item.description}
          host={item.host}
          room={item.room}
          participants={item.participants}
          maxParticipants={item.maxParticipants}
        >
          {item.type.category &&
            item.tags &&
            item.tags.map((tag, idx) => <Tag key={idx} name={tag} />)}
        </ListItem>
      ))}
    </div>
  );
};

export default ItemList;

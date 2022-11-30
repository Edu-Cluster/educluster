import React from 'react';
import Avatar from '../Avatar';
import ButtonGroup from '../ButtonGroup';

type Props = {
  name: string;
  type: string;
  description: string;
  isOnInvitationPage?: boolean;
};

const ClusterBanner = ({
  name,
  type,
  description,
  isOnInvitationPage,
}: Props) => {
  return (
    <div className="h-[700px] w-full max-w-[800px] sm:min-w-[400px] screen-xxl:max-w-[400px] card mt-16 px-8 flex flex-col items-center justify-around">
      <div className="h-auto flex flex-col items-center mt-2">
        <p className="text-md underline">CLUSTER</p>
        <p className="uppercase text-2xl">{name}</p>
        <div className="mt-12 w-full h-24 flex justify-center items-center">
          <Avatar type="cluster" seed={name} bigger={true} />
        </div>
        <p className="mt-12">Clustertyp: {type}</p>
        <p className="mt-4 break-words break-all">{description}</p>
      </div>
      <ButtonGroup clustername={name} isOnInvitationPage={isOnInvitationPage} />
    </div>
  );
};

export default ClusterBanner;

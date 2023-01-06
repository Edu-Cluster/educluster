import React, { useState } from 'react';
import Avatar from '../Avatar';
import ClusterButtonGroup from './ClusterButtonGroup';
import useStore from '../../client/store';

type Props = {
  name: string;
  isPrivate: boolean;
  description: string;
  isOnInvitationPage?: boolean;
};

const ClusterBanner = ({
  name,
  isPrivate,
  description,
  isOnInvitationPage,
}: Props) => {
  const { editMode } = useStore();
  const [isSliderOn, setSliderOn] = useState(isPrivate);
  const clustername = name && name.split('*')[0];

  return (
    <div className="h-[700px] w-full max-w-[800px] sm:min-w-[400px] screen-xxl:max-w-[400px] card mt-16 px-8 flex flex-col items-center justify-around">
      {!editMode ? (
        <div className="h-auto flex flex-col items-center mt-2">
          <p className="text-md underline">CLUSTER</p>
          <p className="text-2xl">{clustername}</p>
          <div className="mt-12 w-full h-24 flex justify-center items-center">
            <Avatar type="cluster" seed={clustername} bigger={true} />
          </div>
          <p className="mt-12 uppercase">
            {isPrivate ? 'PRIVAT' : 'ÖFFENTLICH'}
          </p>
          <p className="mt-4 break-words break-word text-[16px]">
            {description}
          </p>
        </div>
      ) : (
        <form className="h-auto flex flex-col items-center mt-2 input-mask">
          <p className="text-md underline">CLUSTER</p>
          <div className="input-box mt-4">
            <input
              name="clustername"
              type="text"
              maxLength={20}
              placeholder={clustername}
            />
          </div>
          <div className="mt-12 w-full h-24 flex justify-center items-center">
            <Avatar type="cluster" seed={clustername} bigger={true} />
          </div>
          <div className="flex items-center text-center mt-6 mb-6">
            <span
              className={`text-md w-[130px] mr-5 ${
                isSliderOn ? 'text-gray-400 line-through' : 'text-[#546de5]'
              }`}
            >
              Öffentliches Cluster
            </span>
            <label className="switch">
              <input
                type="checkbox"
                checked={isSliderOn}
                onChange={() => setSliderOn((prevState) => !prevState)}
              />
              <span className="slider round"></span>
            </label>
            <span
              className={`text-md w-[130px] ml-5 ${
                !isSliderOn ? 'text-gray-400 line-through' : 'text-[#546de5]'
              }`}
            >
              Privates Cluster
            </span>
          </div>
          <div className="w-full h-40 input-text-area-box">
            <textarea
              className="w-full h-full resize-none"
              name="description"
              maxLength={100}
              placeholder={description}
            />
          </div>
        </form>
      )}
      <ClusterButtonGroup
        clusterfullname={name}
        isOnInvitationPage={isOnInvitationPage}
      />
    </div>
  );
};

export default ClusterBanner;

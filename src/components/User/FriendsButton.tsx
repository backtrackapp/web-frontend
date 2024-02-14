import type { FC } from 'react';
import { useState } from 'react';
import type { UserPublic } from '@/utils/statsfm';
import { FriendStatus } from '@/utils/statsfm';
import { useApi } from '@/hooks';
import { MdInfo } from 'react-icons/md';
import { FriendsButtonFrame } from './FriendsButtonFrame';
import { Square } from '../Square';

// TODO: Change to useEffect

export const FriendsButton: FC<{
  friendUser: UserPublic;
  initialFriendStatus: FriendStatus;
}> = ({ friendUser, initialFriendStatus }) => {
  const api = useApi();
  const [friendStatus, setFriendStatus] =
    useState<FriendStatus>(initialFriendStatus);

  const handleAccept = () => {
    api.friends.acceptRequest(friendUser.id);
    setFriendStatus(FriendStatus.FRIENDS);
  };

  const handleRemove = () => {
    api.friends.remove(friendUser.id);
    setFriendStatus(FriendStatus.NONE);
  };

  const handleDeny = () => {
    api.friends.denyRequest(friendUser.id);
    setFriendStatus(FriendStatus.NONE);
  };

  const handleCancel = () => {
    api.friends.cancelRequest(friendUser.id);
    setFriendStatus(FriendStatus.NONE);
  };

  const handleSend = () => {
    api.friends.sendRequest(friendUser.id);
    setFriendStatus(FriendStatus.REQUEST_OUTGOING);
  };

  const noop = () => {
    // Do nothing
  };

  if (friendUser.userBan) {
    switch (friendStatus) {
      case FriendStatus.FRIENDS:
        return (
          <FriendsButtonFrame red handler={handleRemove}>
            <span className="flex items-center">
              <span className="mr-2">
                <MdInfo />
              </span>
              Remove friend
            </span>
          </FriendsButtonFrame>
        );
      case FriendStatus.REQUEST_INCOMING:
        return (
          <FriendsButtonFrame handler={handleDeny}>
            <span className="flex items-center">
              <span className="mr-2">
                <MdInfo />
              </span>
              Decline friend request
            </span>
          </FriendsButtonFrame>
        );
      case FriendStatus.REQUEST_OUTGOING:
        return (
          <FriendsButtonFrame red handler={handleCancel}>
            <span className="flex items-center">
              <span className="mr-2">
                <MdInfo />
              </span>
              Cancel friend request
            </span>
          </FriendsButtonFrame>
        );
      default:
        return (
          <FriendsButtonFrame handler={noop}>
            <span className="flex items-center">
              <span className="mr-2">
                <MdInfo />
              </span>
              This user has been banned, you cannot send a friend request
            </span>
          </FriendsButtonFrame>
        );
    }
  }

  switch (friendStatus) {
    case FriendStatus.FRIENDS:
      return (
        <FriendsButtonFrame red handler={handleRemove}>
          Remove friend
        </FriendsButtonFrame>
      );
    case FriendStatus.REQUEST_INCOMING:
      return (
        <>
          <FriendsButtonFrame handler={handleAccept}>
            Accept friend request
          </FriendsButtonFrame>
          <span className="mx-2">
            <Square />
          </span>
          <FriendsButtonFrame red handler={handleDeny}>
            Decline friend request
          </FriendsButtonFrame>
        </>
      );
    case FriendStatus.REQUEST_OUTGOING:
      return (
        <FriendsButtonFrame red handler={handleCancel}>
          Cancel friend request
        </FriendsButtonFrame>
      );
    default:
      return (
        <FriendsButtonFrame handler={handleSend}>
          Send friend request
        </FriendsButtonFrame>
      );
  }
};

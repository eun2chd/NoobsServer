import React from "react";
import UserContainer from "./UserContainer";
import ModalButton from "./ModalButton";

import { User } from "../../commonTypes";

interface MenuProps {
  setHeaderText: (text: string) => void;
  allUsers: User[];
  handleAddUser: (user: User) => void;
  setIsDraftModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMode: React.Dispatch<React.SetStateAction<string>>;
  selectedMode: string;
  modalType: string;
  isDraftModalOpen: boolean;
  addedUsers: User[];
  setAddedUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setIsUserAdded: React.Dispatch<React.SetStateAction<boolean>>;
  openModal: (type: string) => void;
  closeModal: () => void;
  handleDeleteUser: (userId: number) => void;
}

const Menu: React.FC<MenuProps> = ({
  setHeaderText,
  allUsers,
  handleAddUser,
  setIsDraftModalOpen,
  setSelectedMode,
  selectedMode,
  modalType,
  isDraftModalOpen,
  addedUsers,
  setAddedUsers,
  setIsUserAdded,
  openModal,
  closeModal,
  handleDeleteUser,
}) => {
  return (
    <div className="relative">
      <ModalButton
        setHeaderText={setHeaderText}
        modalType={modalType}
        selectedMode={selectedMode}
        setIsDraftModalOpen={setIsDraftModalOpen}
        setSelectedMode={setSelectedMode}
        isDraftModalOpen={isDraftModalOpen}
        setIsUserAdded={setIsUserAdded}
        openModal={openModal}
        closeModal={closeModal}
      />
      <div className="lg:col-span-1 lg:row-span-3">
        <UserContainer
          allUsers={allUsers.filter(
            (user) => !addedUsers.some((u) => u.id === user.id)
          )}
          handleAddUser={handleAddUser}
          setAddedUsers={setAddedUsers}
          setIsUserAdded={setIsUserAdded}
          handleDeleteUser={handleDeleteUser}
        />
      </div>
    </div>
  );
};

export default Menu;

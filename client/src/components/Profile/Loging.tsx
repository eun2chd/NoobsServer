import React from 'react';

interface ModalProps {
  message: string;
}

const LoadingModal: React.FC<ModalProps> = ({ message }) => {
  return (
<div className="fixed top-0 left-0 w-full h-full bg-blue-900 bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-gray-800 p-12 rounded-3xl shadow-lg border-4 border-[rgb(200, 155, 60)]">
    <p className="text-white text-2xl font-black font-blackHanSans">{message}</p>
  </div>
</div>
  );
};

export default LoadingModal;

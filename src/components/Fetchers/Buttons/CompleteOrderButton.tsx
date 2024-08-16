import React from 'react';

interface Props {
  handleComplete: () => void;
}

const CompleteOrderButton: React.FC<Props> = ({ handleComplete }) => (
  <button onClick={handleComplete} className="bg-blue-500 text-white py-2 px-4 rounded">
    Hoàn Thành
  </button>
);

export default CompleteOrderButton;

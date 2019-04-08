import React from 'react';
import { ScaleLoader } from 'react-spinners';

import '../../styles/LoadingSpinner.scss';

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <ScaleLoader
      color="#484747"
      height={35}
      width={5}
      radius={3}
      loading
    />
  </div>
);

export default LoadingSpinner;

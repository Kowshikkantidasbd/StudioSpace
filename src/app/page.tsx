import React from 'react';
import { HomePage } from '../pages/HomePage.tsx';

interface PageProps {
  navigate: (path: string) => void;
}

export const Page: React.FC<PageProps> = ({ navigate }) => {
  return <HomePage navigate={navigate} />;
};

export default Page;

import { PROFILE } from '../Constant';

export default function Portada() {
  return (
    <div className={`flex items-center justify-center w-full min-h-screen py-4 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 relative bg-black`}>
      <img
        src='.assets/logos/icon.png'
        alt={PROFILE.name}
        className="w-full max-h-[80vh] max-w-7xl object-contain"
      />
    </div>
  );
};

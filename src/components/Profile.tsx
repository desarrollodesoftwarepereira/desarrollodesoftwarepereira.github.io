import {
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaGlobe,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaGithub,
  FaMap
} from 'react-icons/fa6';
import { PROFILE } from '../Constant';

const Profile: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 xs:gap-4 sm:flex-row">
        <div className='min-w-42'>
            <img
                src="/assets/logos/logo.png"
                alt="Profile Icon"
                className="rounded-full w-42 h-42"
            />
        </div>
        <div className="flex flex-col flex-1 gap-2 text-center xs:gap-4">
            <h1 className='p-0 m-0 text-3xl xs:text-4xl'>{PROFILE.name}</h1>
            <p className='text-lg xs:text-xl'>{PROFILE.description}</p>
            <div className="flex flex-wrap justify-center gap-4 py-1">
                {PROFILE.socialLinks.email && (
                    <a href={`mailto:${PROFILE.socialLinks.email}`} target='_blank'>
                        <FaEnvelope className="text-2xl text-gray-500 xs:text-3xl" />
                    </a>
                )}
                <a href={`tel:${PROFILE.socialLinks.phone}`} target='_blank'>
                    <FaPhone className="text-2xl text-yellow-500 xs:text-3xl" />
                </a>
                <a href={`https://wa.me/${PROFILE.socialLinks.whatsappNumber}`} target='_blank'>
                    <FaWhatsapp className="text-2xl text-green-500 xs:text-3xl" />
                </a>
                {PROFILE.socialLinks.websiteUrl && (
                    <a href={PROFILE.socialLinks.websiteUrl} target='_blank'>
                        <FaGlobe className="text-2xl text-blue-500 xs:text-3xl" />
                    </a>
                )}
                {PROFILE.socialLinks.facebook && (
                    <a href={PROFILE.socialLinks.facebook} target='_blank'>
                        <FaFacebookF className="text-2xl text-blue-600 xs:text-3xl" />
                    </a>
                )}
                {PROFILE.socialLinks.instagram && (
                    <a href={PROFILE.socialLinks.instagram} target='_blank'>
                        <FaInstagram className="text-2xl text-pink-500 xs:text-3xl" />
                    </a>
                )}
                {PROFILE.socialLinks.twitter && (
                    <a href={PROFILE.socialLinks.twitter} target='_blank'>
                        <FaTwitter className="text-2xl text-blue-400 xs:text-3xl" />
                    </a>
                )}
                {PROFILE.socialLinks.linkedin && (
                    <a href={PROFILE.socialLinks.linkedin} target='_blank'>
                        <FaLinkedinIn className="text-2xl text-blue-700 xs:text-3xl" />
                    </a>
                )}
                {PROFILE.socialLinks.github && (
                    <a href={PROFILE.socialLinks.github} target='_blank'>
                        <FaGithub className="text-2xl text-gray-900 xs:text-3xl" />
                    </a>
                )}
                {PROFILE.socialLinks.maps && (
                    <a href={PROFILE.socialLinks.maps} target='_blank'>
                        <FaMap className="text-2xl text-red-600 xs:text-3xl" />
                    </a>
                )}
            </div>
        </div>
    </div>
  );
}

export default Profile;
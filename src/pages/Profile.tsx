
import { useState } from "react";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { EditAddressModal } from "@/components/profile/EditAddressModal";
import { ServiceCategoriesModal } from "@/components/profile/ServiceCategoriesModal";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { ContactCard } from "@/components/profile/ContactCard";
import { ServiceCategoriesSection } from "@/components/profile/ServiceCategoriesSection";
import { UserCompanies } from "@/components/profile/UserCompanies";
import { UserVenues } from "@/components/profile/UserVenues";
import { useProfileData } from "@/hooks/useProfileData";

const Profile = () => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [isServiceCategoriesOpen, setIsServiceCategoriesOpen] = useState(false);
  const { userData, loading, handleProfileUpdated } = useProfileData();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-24 w-24 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-48 mb-2.5"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  const handleProfileModalSuccess = () => {
    setIsEditProfileOpen(false);
    handleProfileUpdated();
  };

  const handleAddressUpdated = () => {
    handleProfileUpdated();
    setIsEditAddressOpen(false);
  };

  const handleServiceCategoriesUpdated = () => {
    setIsServiceCategoriesOpen(false);
    handleProfileUpdated();
  };

  const isProvider = userData.role === 'provider';
  const isContractor = userData.role === 'contractor';
  const isAdvertiser = userData.role === 'advertiser';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Meu Perfil</h2>
        <p className="text-muted-foreground mt-2">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <ProfileCard 
          userData={userData} 
          onAvatarUpdated={handleProfileUpdated}
          onEditProfile={() => setIsEditProfileOpen(true)}
        />

        {/* Contact & Address Card */}
        <ContactCard 
          userData={userData} 
          onEditAddress={() => setIsEditAddressOpen(true)}
        />
      </div>

      {/* Provider Services Section */}
      {isProvider && (
        <ServiceCategoriesSection 
          onManageServices={() => setIsServiceCategoriesOpen(true)}
        />
      )}

      {/* Company management for contractors */}
      {isContractor && (
        <UserCompanies />
      )}

      {/* Venue management for advertisers */}
      {isAdvertiser && (
        <UserVenues />
      )}

      {/* Modals */}
      {isEditProfileOpen && (
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          onSuccess={handleProfileModalSuccess}
          userData={userData}
        />
      )}

      {isEditAddressOpen && (
        <EditAddressModal
          isOpen={isEditAddressOpen}
          onClose={() => setIsEditAddressOpen(false)}
          onSuccess={handleAddressUpdated}
          userData={userData}
        />
      )}

      {isServiceCategoriesOpen && (
        <ServiceCategoriesModal
          isOpen={isServiceCategoriesOpen}
          onClose={() => setIsServiceCategoriesOpen(false)}
          onSuccess={handleServiceCategoriesUpdated}
        />
      )}
    </div>
  );
};

export default Profile;

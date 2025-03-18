import { useState } from "react";
import { FaPen } from "react-icons/fa";
import UserProfile from "./UserProfile";
import Education from "./Education";
import WorkExperience from "./WorkExperience";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div className="flex flex-col md:flex-row max-w-5xl mx-auto p-4 gap-6">
      {/* Sidebar */}
      <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 bg-white shadow-lg rounded-2xl">
        {activeTab === "Profile" && <UserProfile />}
        {activeTab === "Education" && <Education />}
        {activeTab === "Work Experience" && <WorkExperience />}
      </div>
    </div>
  );
}

function ProfileSidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-80">
      {/* Profile Picture Section */}
      <div className="relative flex flex-col items-center">
        <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
        <button className="absolute bottom-2 right-6 bg-white border p-2 rounded-full shadow-md hover:bg-gray-100">
          <FaPen className="text-gray-600 text-sm" />
        </button>
      </div>

      {/* User Name */}
      <h2 className="text-lg font-semibold text-center mt-4">Rakesh Raushan</h2>

      {/* Navigation Links */}
      <div className="mt-6 space-y-2">
        <NavItem
          label="Profile"
          active={activeTab === "Profile"}
          setActiveTab={setActiveTab}
        />
        <NavItem
          label="Education"
          active={activeTab === "Education"}
          setActiveTab={setActiveTab}
        />
        <NavItem
          label="Work Experience"
          active={activeTab === "Work Experience"}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
}

// Reusable Navigation Item Component
const NavItem = ({
  label,
  active,
  setActiveTab,
}: {
  label: string;
  active: boolean;
  setActiveTab: (tab: string) => void;
}) => {
  return (
    <div
      onClick={() => setActiveTab(label)}
      className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition ${
        active ? "bg-gray-100 font-bold" : "hover:bg-gray-50"
      }`}
    >
      <div className="w-5 h-5 bg-gray-200 rounded-md"></div>
      <span className="text-sm">{label}</span>
    </div>
  );
};

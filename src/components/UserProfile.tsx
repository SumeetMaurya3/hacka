import { useState, useEffect, Fragment } from "react";
import { FaPen } from "react-icons/fa";
import { db } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Dialog, Transition } from "@headlessui/react";
interface UserInfo {
  firstname: string;
  lastname: string;
  age: number | null;
  address: string;
  email: string;
  phonenumber: string;
  bio: string;
  preferred_language: string[];
  interested_topic: string[];
}

export default function UserProfile() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [isEditingLang, setIsEditingLang] = useState(false);
  const handleEditLang = () => setIsEditingLang(true);
  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };
  const availableLanguages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
  ];

  const [formData, setFormData] = useState<UserInfo>({
    firstname: "",
    lastname: "",
    age: null,
    address: "",
    email: "",
    phonenumber: "",
    bio: "",
    preferred_language: [],
    interested_topic: [], // ✅ Add this
  });

  const [bio, setBio] = useState<string>("");

  const auth = getAuth();
  const user = auth.currentUser;
  const [isEditingTopics, setIsEditingTopics] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // Open edit modal
  const handleEditTopics = () => {
    setSelectedTopics(userInfo?.interested_topic || []);
    setIsEditingTopics(true);
  };

  // Toggle topic selection
  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  // Save topics to Firestore
  const handleSaveTopics = async () => {
    if (!user) return;
    await updateDoc(doc(db, "ClientInfo", user.uid), {
      interested_topic: selectedTopics,
    });
    setUserInfo((prev) =>
      prev ? { ...prev, interested_topic: selectedTopics } : null
    );
    setIsEditingTopics(false);
  };

  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, "ClientInfo", user.uid);

    getDoc(userDocRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserInfo;
          setUserInfo(data);
          setBio(data.bio);
          setSelectedLanguages(data.preferred_language || []);
        }
      })
      .catch((error) => console.error("Error fetching user info:", error));
  }, [user]);

  const handleEdit = () => {
    if (userInfo) setFormData(userInfo);
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || null : value,
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    const userDocRef = doc(db, "ClientInfo", user.uid);
    try {
      await updateDoc(userDocRef, { ...formData });
      setUserInfo(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  // Handle Bio Edit
  const handleEditBio = () => setIsEditingBio(true);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const handleSaveBio = async () => {
    if (!user) return;
    const userDocRef = doc(db, "ClientInfo", user.uid);
    try {
      await updateDoc(userDocRef, { bio });
      setUserInfo((prev) => (prev ? { ...prev, bio } : null));
      setIsEditingBio(false);
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  const handleSaveLang = async () => {
    if (!user) return;
    await updateDoc(doc(db, "ClientInfo", user.uid), {
      preferred_language: selectedLanguages,
    });
    setIsEditingLang(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <ProfileSection title="Personal Information" onEdit={handleEdit}>
        <InfoRow label="First Name" value={userInfo?.firstname || "N/A"} />
        <InfoRow label="Last Name" value={userInfo?.lastname || "N/A"} />
        <InfoRow label="Age" value={userInfo?.age?.toString() || "N/A"} />
        <InfoRow label="Address" value={userInfo?.address || "N/A"} />
      </ProfileSection>

      <ProfileSection title="Contact Information" onEdit={handleEdit}>
        <InfoRow label="Email" value={userInfo?.email || "N/A"} />
        <InfoRow label="Phone Number" value={userInfo?.phonenumber || "N/A"} />
      </ProfileSection>

      {/* Bio Section */}
      <ProfileSection title="Bio" onEdit={handleEditBio}>
        <p className="text-gray-600 text-sm">{bio || "No bio available"}</p>
      </ProfileSection>

      <ProfileSection title="Preferred Language" onEdit={handleEditLang}>
        <TagList items={selectedLanguages} />
      </ProfileSection>

      {/* Interested Topics */}
      <ProfileSection title="Interested Topic" onEdit={handleEditTopics}>
        <TagList items={userInfo?.interested_topic || []} />
      </ProfileSection>

      <Transition appear show={isEditingLang} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsEditingLang(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <Dialog.Title className="text-lg font-semibold mb-4">
                Preferred Language
              </Dialog.Title>
              <div className="space-y-2">
                {availableLanguages.map((lang) => (
                  <label key={lang} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedLanguages.includes(lang)}
                      onChange={() => toggleLanguage(lang)}
                      className="h-4 w-4"
                    />
                    <span className="text-gray-700">{lang}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setIsEditingLang(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLang}
                  className="px-4 py-2 bg-black text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Personal Info Modal */}
      <Transition appear show={isEditing} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsEditing(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <Dialog.Title className="text-lg font-semibold text-center mb-4">
                Edit Information
              </Dialog.Title>

              <input
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full p-2 border rounded-md mb-2"
              />
              <input
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full p-2 border rounded-md mb-2"
              />
              <input
                name="age"
                type="number"
                value={formData.age || ""}
                onChange={handleChange}
                placeholder="Age"
                className="w-full p-2 border rounded-md mb-2"
              />
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full p-2 border rounded-md mb-2"
              />
              <input
                name="email"
                value={formData.email}
                disabled
                className="w-full p-2 border bg-gray-200 rounded-md mb-2 cursor-not-allowed"
              />
              <input
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-2 border rounded-md mb-2"
              />

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-black text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Bio Modal */}
      <Transition appear show={isEditingBio} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsEditingBio(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <Dialog.Title className="text-lg font-semibold text-center mb-4">
                Edit Bio
              </Dialog.Title>
              <textarea
                value={bio}
                onChange={handleBioChange}
                rows={4}
                className="w-full p-2 border rounded-md"
              ></textarea>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setIsEditingBio(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBio}
                  className="px-4 py-2 bg-black text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isEditingTopics} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsEditingTopics(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <Dialog.Title className="text-lg font-semibold mb-4">
                Interested Topics
              </Dialog.Title>

              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTopics.map((topic) => (
                  <span
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className="px-3 py-1 bg-gray-300 text-sm rounded-full cursor-pointer"
                  >
                    {topic} ✕
                  </span>
                ))}
              </div>

              <h3 className="text-sm font-semibold mb-2">Suggested</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Design",
                  "Marketing",
                  "Sales",
                  "Finance",
                  "Dance",
                  "Business",
                ].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`px-3 py-1 border rounded-full ${
                      selectedTopics.includes(topic)
                        ? "bg-black text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    + {topic}
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setIsEditingTopics(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTopics}
                  className="px-4 py-2 bg-black text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

const TagList = ({ items }: { items: string[] }) => (
  <div className="flex flex-wrap gap-2">
    {items.length > 0 ? (
      items.map((item) => (
        <span key={item} className="bg-gray-200 px-2 py-1 rounded-md text-sm">
          {item}
        </span>
      ))
    ) : (
      <span className="text-gray-400 text-sm">
        No preferred languages selected
      </span>
    )}
  </div>
);

// Helper Components
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-2 border-b last:border-b-0">
    <span className="text-gray-500 text-sm font-semibold mr-6">{label}</span>
    <span className="text-gray-700 text-sm">{value}</span>
  </div>
);

const ProfileSection = ({
  title,
  children,
  onEdit,
}: {
  title: string;
  children: React.ReactNode;
  onEdit?: () => void;
}) => (
  <div className="bg-gray-50 p-4 rounded-lg mt-4 shadow-sm">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-gray-900 font-semibold text-sm">{title}</h3>
      {onEdit && (
        <button
          onClick={onEdit}
          className="text-gray-500 hover:text-gray-700 transition"
        >
          <FaPen size={14} />
        </button>
      )}
    </div>
    {children}
  </div>
);

import { FaPen } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import AddEducationModal from "./AddEduction"; // Fixed typo in import
import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

interface EducationItem {
  id: string;
  institution: string; // ✅ Changed from "college" to "institution"
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export default function Education() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [educationData, setEducationData] = useState<EducationItem[]>([]);
  const [selectedEducation, setSelectedEducation] =
    useState<EducationItem | null>(null);

  // Fetch Education Data from Firestore
  useEffect(() => {
    const fetchEducation = async () => {
      const currentUser = getAuth().currentUser;
      if (!currentUser) return;

      const userDocRef = doc(db, "Education", currentUser.uid);

      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEducationData(data.education || []);
        }
      } catch (error) {
        console.error("Error fetching education data:", error);
      }
    };

    fetchEducation();
  }, [isModalOpen]);

  // Handle Edit Click
  const handleEdit = (education: EducationItem) => {
    setSelectedEducation(education);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-900 font-semibold text-lg">Education</h2>
        <button
          onClick={() => {
            setSelectedEducation(null); // Reset for adding new
            setIsModalOpen(true);
          }}
          className="flex items-center bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
        >
          <FaPlus className="mr-2" /> Add
        </button>
        <AddEducationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={selectedEducation} // ✅ No TypeScript error now
        />
      </div>

      {/* Education Cards */}
      <div className="space-y-4">
        {educationData.length > 0 ? (
          educationData.map((edu) => (
            <EducationCard
              key={edu.id}
              {...edu}
              onEdit={() => handleEdit(edu)}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No education details added yet.
          </p>
        )}
      </div>
    </div>
  );
}

// Individual Education Card
const EducationCard = ({
  institution, // ✅ Changed from "college" to "institution"
  degree,
  fieldOfStudy,
  startDate,
  endDate,
  onEdit,
}: EducationItem & { onEdit: () => void }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-start">
    <div className="flex items-start space-x-4">
      <div className="w-14 h-14 bg-gray-300 rounded-lg"></div>
      <div>
        <h3 className="font-semibold text-gray-900">{institution}</h3>
        <p className="text-sm text-gray-600">
          {degree} in {fieldOfStudy}
        </p>
        <p className="text-sm text-gray-500">
          {startDate} to {endDate}
        </p>
      </div>
    </div>
    <button
      className="text-gray-500 hover:text-gray-700 transition"
      onClick={onEdit}
    >
      <FaPen size={14} />
    </button>
  </div>
);

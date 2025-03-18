import { useState, useEffect } from "react";
import { FaPen, FaPlus } from "react-icons/fa";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import AddWorkModal from "./AddWorkModal";

interface WorkItem {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  employmentType: string;
  industry: string;
  location: string;
}

export default function WorkExperience() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [workData, setWorkData] = useState<WorkItem[]>([]);
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);

  // Fetch Work Experience from Firestore
  useEffect(() => {
    const fetchWorkExperience = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const workDocRef = doc(db, "Work", user.uid);

      try {
        const docSnap = await getDoc(workDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setWorkData(data.work || []);
        }
      } catch (error) {
        console.error("Error fetching work experience:", error);
      }
    };

    fetchWorkExperience();
  }, [isModalOpen]);

  const handleEdit = (work: WorkItem) => {
    setSelectedWork(work);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-900 font-semibold text-lg">Work Experience</h2>
        <button
          onClick={() => {
            setSelectedWork(null);
            setIsModalOpen(true);
          }}
          className="flex items-center bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
        >
          <FaPlus className="mr-2" /> Add
        </button>
      </div>

      {/* Work Experience Cards */}
      <div className="space-y-4">
        {workData.length > 0 ? (
          workData.map((job) => (
            <WorkExperienceCard
              key={job.id}
              {...job}
              onEdit={() => handleEdit(job)}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No work experience added yet.
          </p>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AddWorkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedWork}
      />
    </div>
  );
}

// Individual Work Experience Card
const WorkExperienceCard = ({
  position,
  company,
  startDate,
  endDate,
  employmentType,
  industry,
  location,
  onEdit,
}: WorkItem & { onEdit: () => void }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
    <div className="flex items-center">
      <div className="h-20 w-20 bg-gray-100 rounded-lg mr-10"></div>
      <div>
        <h3 className="font-semibold text-gray-900">{position}</h3>
        <p className="text-sm text-gray-600">{company}</p>
        <p className="text-sm text-gray-500">
          {startDate} - {endDate}
        </p>
        <p className="text-sm text-gray-500">{employmentType}</p>
        <p className="text-sm text-gray-500">{industry}</p>
        <p className="text-sm text-gray-500">{location}</p>
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

import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Dialog } from "@headlessui/react";

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

interface AddWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: WorkItem | null;
}

export default function AddWorkModal({
  isOpen,
  onClose,
  initialData,
}: AddWorkModalProps) {
  const [formData, setFormData] = useState<WorkItem>({
    id: "",
    position: "",
    company: "",
    startDate: "",
    endDate: "",
    employmentType: "",
    industry: "",
    location: "",
  });

  // When the modal opens, reset or fill data based on initialData
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: "",
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        employmentType: "",
        industry: "",
        location: "",
      });
    }
  }, [isOpen, initialData]); // Reset fields when modal opens

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const workDocRef = doc(db, "Work", user.uid);

    try {
      // Fetch existing work data
      const workDocSnap = await getDoc(workDocRef);
      const existingData = workDocSnap.exists()
        ? workDocSnap.data().work || []
        : [];

      let updatedWork;

      if (initialData) {
        // Editing existing work entry
        updatedWork = existingData.map((work: WorkItem) =>
          work.id === initialData.id
            ? { ...formData, id: initialData.id }
            : work
        );
      } else {
        // Adding new work entry
        updatedWork = [
          ...existingData,
          { ...formData, id: Date.now().toString() },
        ];
      }

      await updateDoc(workDocRef, { work: updatedWork });

      onClose(); // Close modal after saving
    } catch (error) {
      console.error("Error saving work experience:", error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 flex items-center justify-center"
    >
      <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
        <h2 className="text-lg font-semibold mb-4">
          {initialData ? "Edit Work Experience" : "Add Work Experience"}
        </h2>
        <input
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Job Title"
          className="w-full p-2 border rounded-md mb-2"
        />
        <input
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Company Name"
          className="w-full p-2 border rounded-md mb-2"
        />
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          placeholder="Start Date"
          className="w-full p-2 border rounded-md mb-2"
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          placeholder="End Date"
          className="w-full p-2 border rounded-md mb-2"
        />
        <input
          name="employmentType"
          value={formData.employmentType}
          onChange={handleChange}
          placeholder="Employment Type"
          className="w-full p-2 border rounded-md mb-2"
        />
        <input
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          placeholder="Industry"
          className="w-full p-2 border rounded-md mb-2"
        />
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location/City"
          className="w-full p-2 border rounded-md mb-2"
        />
        <button
          onClick={handleSave}
          className="mt-4 bg-black text-white px-4 py-2 rounded-lg w-full"
        >
          {initialData ? "Update" : "Add"}
        </button>
      </Dialog.Panel>
    </Dialog>
  );
}

import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Dialog } from "@headlessui/react";

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

interface AddEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: EducationItem | null;
}

export default function AddEducationModal({
  isOpen,
  onClose,
  initialData,
}: AddEducationModalProps) {
  const [degree, setDegree] = useState<string>("");
  const [institution, setInstitution] = useState<string>("");
  const [fieldOfStudy, setFieldOfStudy] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setDegree(initialData.degree);
      setInstitution(initialData.institution);
      setFieldOfStudy(initialData.fieldOfStudy);
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
    } else {
      setDegree("");
      setInstitution("");
      setFieldOfStudy("");
      setStartDate("");
      setEndDate("");
    }
  }, [initialData]);

  const handleSave = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "Education", user.uid);

    try {
      // 🔹 Fetch existing education array
      const userDocSnap = await getDoc(userDocRef);
      const existingData = userDocSnap.exists()
        ? userDocSnap.data().education || []
        : [];

      let updatedEducation;

      if (initialData) {
        // 🔥 Update existing entry
        updatedEducation = existingData.map((edu: EducationItem) =>
          edu.id === initialData.id
            ? { ...edu, degree, institution, fieldOfStudy, startDate, endDate }
            : edu
        );
      } else {
        // 🔥 Add new entry
        updatedEducation = [
          ...existingData,
          {
            id: Date.now().toString(),
            degree,
            institution,
            fieldOfStudy,
            startDate,
            endDate,
          },
        ];
      }

      // 🔹 Update Firestore document
      await updateDoc(userDocRef, { education: updatedEducation });

      onClose();
    } catch (error) {
      console.error("Error saving education:", error);
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
          {initialData ? "Edit Education" : "Add Education"}
        </h2>
        <input
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          placeholder="Degree"
          className="w-full p-2 border rounded-md mb-2"
        />
        <input
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          placeholder="Institution"
          className="w-full p-2 border rounded-md mb-2"
        />
        <input
          value={fieldOfStudy}
          onChange={(e) => setFieldOfStudy(e.target.value)}
          placeholder="Field of Study"
          className="w-full p-2 border rounded-md mb-2"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
          className="w-full p-2 border rounded-md mb-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
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

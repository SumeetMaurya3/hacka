import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

interface UserInfo {
  firstname: string;
  lastname: string;
  age: number | null;
  address: string;
  email: string;
  phonenumber: string;
}

export default function EditPersonalInfo({ onClose }: { onClose: () => void }) {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstname: "",
    lastname: "",
    age: null,
    address: "",
    email: "",
    phonenumber: "",
  });

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, "ClientInfo", user.uid);

    const fetchData = async () => {
      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setUserInfo(docSnap.data() as UserInfo);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    const userDocRef = doc(db, "ClientInfo", user.uid);
    try {
      await updateDoc(userDocRef, { ...userInfo });
      onClose();
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Edit Personal Info
        </h2>

        <input
          name="firstname"
          value={userInfo.firstname}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full p-2 border rounded-md mb-2"
        />
        <input
          name="lastname"
          value={userInfo.lastname}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full p-2 border rounded-md mb-2"
        />
        <input
          name="age"
          type="number"
          value={userInfo.age || ""}
          onChange={handleChange}
          placeholder="Age"
          className="w-full p-2 border rounded-md mb-2"
        />
        <input
          name="address"
          value={userInfo.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full p-2 border rounded-md mb-2"
        />
        <input
          name="email"
          type="email"
          value={userInfo.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded-md mb-2"
          disabled // Email is usually not editable
        />
        <input
          name="phonenumber"
          value={userInfo.phonenumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full p-2 border rounded-md mb-2"
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
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
      </div>
    </div>
  );
}

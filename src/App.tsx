import { useEffect, useState } from "react";
import { auth } from "./config/firebase";
import { User } from "firebase/auth"; // Import User type
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

function App() {
  const [user, setUser] = useState<User | null>(null); // Explicitly type user state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <HomePage /> : <LoginPage />;
}

export default App;

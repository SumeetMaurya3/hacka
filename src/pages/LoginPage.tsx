import { auth, googleProvider, db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithPopup } from "firebase/auth";
export default function LoginPage() {
  const SignInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // References to Firestore documents
      const clientRef = doc(db, "ClientInfo", user.uid);
      const educationRef = doc(db, "Education", user.uid);
      const workRef = doc(db, "Work", user.uid);

      const clientSnap = await getDoc(clientRef);

      if (!clientSnap.exists()) {
        await setDoc(clientRef, {
          firstname: user.displayName?.split(" ")[0] || "",
          lastname: user.displayName?.split(" ")[1] || "",
          age: null,
          address: "",
          email: user.email || "",
          phonenumber: "",
          bio: "",
          preferred_language: [],
          interested_topic: [],
          social_media: {},
        });

        await setDoc(educationRef, { education: [] });
        await setDoc(workRef, { work: [] });
      }

      window.location.href = "/";
    } catch (err) {
      console.error("Google Sign-In Error:", err);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div>
              <img
                src="https://img.freepik.com/free-vector/gradient-hub-logo-template_23-2149847151.jpg?t=st=1742277788~exp=1742281388~hmac=fb3b5447f64d54133b7316ad289a55cbd09a6ae2af089f9102fd89320013464f&w=826"
                className="w-32 mx-auto"
                alt="Logo"
              />
            </div>
            <div className="mt-12 flex flex-col items-center">
              <h1 className="text-2xl xl:text-3xl font-extrabold">Sign up</h1>
              <div className="w-full flex-1 mt-8">
                <div className="flex flex-col items-center">
                  <button
                    onClick={SignInWithGoogle}
                    className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                  >
                    <div className="bg-white p-2 rounded-full">
                      <svg className="w-4" viewBox="0 0 533.5 544.3">
                        <path
                          d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                          fill="#4285f4"
                        />
                        <path
                          d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                          fill="#34a853"
                        />
                        <path
                          d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                          fill="#fbbc04"
                        />
                        <path
                          d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                          fill="#ea4335"
                        />
                      </svg>
                    </div>
                    <span className="ml-4">Sign Up with Google</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
            <div
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

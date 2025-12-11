import { useNavigate } from "react-router-dom";
import NotExist from "../assets/NotFound.jpg"


export default function NotFound() {
    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-body dark:bg-dark-body font-Manrope text-center py-4 flex flex-col items-center justify-center">
      <img
        src={NotExist}
        alt="Task not found"
        loading="lazy"
        className="max-w-md border border-border dark:border-dark-border rounded-lg mb-2"
      />
      <p className="text-textContent dark:text-dark-subHeading text-sm">
        404 No found
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="mt-3 text-sm font-medium text-mainHeading dark:text-dark-mainHeading hover:underline"
      >
        back to Dashboard
      </button>
    </div>
  );
}

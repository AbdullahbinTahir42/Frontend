import { useLocation, useNavigate } from 'react-router-dom';

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const steps = ['/', '/resume', '/remote-jobs', '/JobSearch', '/Category', '/Salarly', '/location', '/work', '/career', '/benefit', '/pricing', '/JobGeneration'];
  const currentIndex = steps.indexOf(location.pathname);
  const prev = currentIndex > 0 ? steps[currentIndex - 1] : null;
  const next = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;

  const handleNext = async () => {
    if (location.pathname === '/benefit') {
      if (typeof window.handleBenefitNext === 'function') {
        try {
          await window.handleBenefitNext(); // ✅ Wait for the profile to submit
        } catch (err) {
          console.error("Submission failed:", err);
          return; // ❌ Don’t navigate if submission failed
        }
      }
    }

    if (next) {
      navigate(next);
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white shadow-md">
      <hr className="w-full border-t-2 border-gray-300" />
      <div className="flex justify-between items-center w-full px-10 py-4">
        <button
          onClick={() => prev && navigate(prev)}
          className="px-8 py-2 border border-black text-black rounded-full hover:bg-gray-100 transition duration-300 hover:scale-105"
          disabled={!prev}
        >
          Back
        </button>

        <button
          onClick={handleNext}
          className="px-8 py-2 bg-[#fe9350] text-black rounded-full hover:bg-[#fe9359] transition duration-300 hover:scale-105"
          disabled={!next}
        >
          Next
        </button>
      </div>
    </footer>
  );
}

export default Footer;

import { useState, useRef } from "react";

const CompletionCertificate = ({
  username,
  chapterTitle,
  chapterId,
  completionDate,
  score,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const certificateRef = useRef(null);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handlePrint = () => {
    const printContent = certificateRef.current;
    if (!printContent) return;

    // Modern approach: Create a temporary print stylesheet and use window.print()
    const printStyles = `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-certificate, .print-certificate * {
          visibility: visible;
        }
        .print-certificate {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          font-family: 'Georgia', serif;
        }
        .certificate-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          border: 8px solid #d4af37;
          background: white;
          text-align: center;
        }
        .no-print {
          display: none !important;
        }
      }
    `;

    // Create and inject print styles
    const styleSheet = document.createElement("style");
    styleSheet.textContent = printStyles;
    document.head.appendChild(styleSheet);

    // Clone the certificate content for printing
    const printDiv = document.createElement("div");
    printDiv.className = "print-certificate";
    printDiv.innerHTML = `
      <div class="certificate-content">
        ${printContent.innerHTML}
      </div>
    `;

    // Add to body temporarily
    document.body.appendChild(printDiv);

    // Print using the browser's native print dialog
    window.print();

    // Clean up
    document.body.removeChild(printDiv);
    document.head.removeChild(styleSheet);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getChapterIcon = (chapterId) => {
    const icons = {
      1: "🏠",
      2: "📚",
      3: "✈️",
      4: "📖",
      5: "🇵🇭",
    };
    return icons[chapterId] || "🏆";
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Certificate Content */}
          <div ref={certificateRef} className="p-8 md:p-12">
            <div className="border-8 border-yellow-400 bg-gradient-to-br from-yellow-50 via-white to-yellow-50 p-8 md:p-12 text-center relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 text-4xl text-yellow-400 opacity-20">
                🌟
              </div>
              <div className="absolute top-4 right-4 text-4xl text-yellow-400 opacity-20">
                🌟
              </div>
              <div className="absolute bottom-4 left-4 text-4xl text-yellow-400 opacity-20">
                🌟
              </div>
              <div className="absolute bottom-4 right-4 text-4xl text-yellow-400 opacity-20">
                🌟
              </div>

              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-yellow-600 mb-2">
                  CERTIFICATE
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-700">
                  OF COMPLETION
                </h2>
              </div>

              {/* Main content */}
              <div className="mb-8">
                <p className="text-lg text-gray-600 mb-6">
                  This is to certify that
                </p>

                <div className="mb-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-red-600 border-b-2 border-red-200 pb-2 inline-block">
                    {username}
                  </h3>
                </div>

                <p className="text-lg text-gray-600 mb-4">
                  has successfully completed
                </p>

                <div className="mb-6">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <span className="text-4xl">
                      {getChapterIcon(chapterId)}
                    </span>
                    <h4 className="text-2xl md:text-3xl font-bold text-blue-600">
                      {chapterTitle}
                    </h4>
                  </div>
                  <p className="text-gray-600">
                    in the José Rizal Educational Journey
                  </p>
                </div>

                {score && (
                  <div className="mb-6">
                    <div className="inline-block bg-green-100 border-2 border-green-300 rounded-full px-6 py-2">
                      <span className="text-green-700 font-bold text-lg">
                        Average Score: {score}%
                      </span>
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <p className="text-gray-600">
                    Completed on {formatDate(completionDate)}
                  </p>
                </div>
              </div>

              {/* Signature section */}
              <div className="border-t-2 border-gray-200 pt-8">
                <div className="flex justify-center items-center space-x-8">
                  <div className="text-center">
                    <div className="w-32 h-16 border-b-2 border-gray-400 mb-2 flex items-end justify-center">
                      <span className="text-2xl font-bold text-gray-600">
                        JR
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      José Rizal Educational App
                    </p>
                    <p className="text-xs text-gray-500">Learning Platform</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-xs text-gray-500">
                  "The youth is the hope of our future" - Dr. José Rizal
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center space-x-4 p-6 bg-gray-50 rounded-b-2xl">
            <button
              onClick={handlePrint}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              <span>Print Certificate</span>
            </button>
            <button
              onClick={handleClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionCertificate;

import React from "react";
import { useNavigate } from "react-router-dom";
import "./homepage.css";

export default function Homepage() {
  const navigate = useNavigate();
  const hasToken = !!localStorage.getItem("token");

  return (
    <div className="hp-page">
      <main className="hp-main">
        <section className="hp-hero">
          <div className="hp-heroContent">
            <span className="hp-badge">Quiz-Ez</span>

            {/* Main SEO H1 */}
            <h1 className="hp-title">
              Flashcard Study App for Smarter Learning & Exam Success
            </h1>

            <p className="hp-subtitle">
              Quiz-Ez is a powerful flashcard study app that helps students
              create digital flashcards, practice with quizzes, and track
              progress to improve memory retention and exam performance.
            </p>

            <div className="hp-actions">
              {!hasToken ? (
                <>
                  <button
                    className="hp-btn hp-btnPrimary"
                    onClick={() => navigate("/signup")}
                  >
                    Create Free Account
                  </button>
                  <button
                    className="hp-btn hp-btnGhost"
                    onClick={() => navigate("/signin")}
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="hp-btn hp-btnPrimary"
                    onClick={() => navigate("/sets")}
                  >
                    Go to Study Sets
                  </button>
                  <button
                    className="hp-btn hp-btnGhost"
                    onClick={() => navigate("/stats")}
                  >
                    View Learning Stats
                  </button>
                </>
              )}
            </div>

            <div className="hp-highlights">
              <div className="hp-highlight">
                <div className="hp-highlightTitle">Create Digital Flashcards</div>
                <div className="hp-highlightDesc">
                  Build unlimited study sets in seconds.
                </div>
              </div>
              <div className="hp-highlight">
                <div className="hp-highlightTitle">Practice with Quizzes</div>
                <div className="hp-highlightDesc">
                  Test knowledge using interactive quiz mode.
                </div>
              </div>
              <div className="hp-highlight">
                <div className="hp-highlightTitle">Track Study Progress</div>
                <div className="hp-highlightDesc">
                  Monitor performance and focus on weak topics.
                </div>
              </div>
            </div>
          </div>

          <div className="hp-preview">
            <div className="hp-card">
              <div className="hp-cardTop">
                <span className="hp-pill">Flashcard</span>
                <span className="hp-pill hp-pillMuted">Study Preview</span>
              </div>

              <div className="hp-q">
                <div className="hp-qLabel">Question</div>
                <div className="hp-qText">
                  What is active recall in studying?
                </div>
              </div>

              <div className="hp-a">
                <div className="hp-qLabel">Answer</div>
                <div className="hp-aText">
                  A learning technique that improves memory by actively retrieving information.
                </div>
              </div>
            </div>

            <div className="hp-quickRow">
              <button
                className="hp-quick"
                onClick={hasToken ? () => navigate("/marketplace") : () => navigate("/signin")}
              >
                Study Marketplace
                <span className="hp-quickHint">
                  Discover public flashcard sets
                </span>
              </button>
              <button
                className="hp-quick"
                onClick={hasToken ? () => navigate("/profile") : () => navigate("/signin")}
              >
                Profile
                <span className="hp-quickHint">
                  Manage your learning account
                </span>
              </button>
            </div>
          </div>
        </section>

        <section className="hp-section">
          <h2 className="hp-h2">How Our Flashcard Study App Works</h2>

          <div className="hp-steps">
            <div className="hp-step">
              <div className="hp-stepNum">1</div>
              <div className="hp-stepBody">
                <div className="hp-stepTitle">Create Study Sets</div>
                <div className="hp-stepDesc">
                  Add questions and answers to build personalized digital flashcards.
                </div>
              </div>
            </div>

            <div className="hp-step">
              <div className="hp-stepNum">2</div>
              <div className="hp-stepBody">
                <div className="hp-stepTitle">Practice & Test Yourself</div>
                <div className="hp-stepDesc">
                  Use flashcard mode or quiz practice to strengthen retention.
                </div>
              </div>
            </div>

            <div className="hp-step">
              <div className="hp-stepNum">3</div>
              <div className="hp-stepBody">
                <div className="hp-stepTitle">Improve & Track Progress</div>
                <div className="hp-stepDesc">
                  Analyze performance stats and focus on weaker subjects.
                </div>
              </div>
            </div>
          </div>

          <div className="hp-cta">
            <div>
              <div className="hp-ctaTitle">
                Ready to improve your study results?
              </div>
              <div className="hp-ctaDesc">
                Join thousands of students using our flashcard study app to
                prepare for exams and learn more effectively.
              </div>
            </div>
            <button
              className="hp-btn hp-btnPrimary"
              onClick={() => navigate(hasToken ? "/sets" : "/signup")}
            >
              {hasToken ? "Start Studying" : "Create Free Account"}
            </button>
          </div>
        </section>
      </main>

      <footer className="hp-footer">
        <span>© {new Date().getFullYear()} Quiz-Ez</span>
      </footer>
    </div>
  );
}
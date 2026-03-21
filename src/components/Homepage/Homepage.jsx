import React from "react";
import { Link } from "react-router-dom";
import "./homepage.css";

export default function Homepage() {
  const hasToken = !!localStorage.getItem("token");

  return (
    <div className="hp-page">
      <main className="hp-main">
        <section className="hp-hero">
          <div className="hp-heroContent">
            <span className="hp-badge">Quiz-Ez</span>

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
                  <Link to="/signup" className="hp-btn hp-btnPrimary">
                    Create Free Account
                  </Link>

                  <Link to="/signin" className="hp-btn hp-btnGhost">
                    Sign In
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/sets" className="hp-btn hp-btnPrimary">
                    Go to Study Sets
                  </Link>

                  <Link to="/stats" className="hp-btn hp-btnGhost">
                    View Learning Stats
                  </Link>
                </>
              )}
            </div>

            <div className="hp-highlights">
              <div className="hp-highlight">
                <div className="hp-highlightTitle">
                  Create Digital Flashcards
                </div>
                <div className="hp-highlightDesc">
                  Build unlimited study sets in seconds.
                </div>
              </div>

              <div className="hp-highlight">
                <div className="hp-highlightTitle">
                  Practice with Quizzes
                </div>
                <div className="hp-highlightDesc">
                  Test knowledge using interactive quiz mode.
                </div>
              </div>

              <div className="hp-highlight">
                <div className="hp-highlightTitle">
                  Track Study Progress
                </div>
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
                  A learning technique that improves memory by actively retrieving
                  information.
                </div>
              </div>
            </div>

            <div className="hp-quickRow">
              <Link
                to={hasToken ? "/marketplace" : "/signin"}
                className="hp-quick"
              >
                Study Marketplace
                <span className="hp-quickHint">
                  Discover public flashcard sets
                </span>
              </Link>

              <Link
                to={hasToken ? "/profile" : "/signin"}
                className="hp-quick"
              >
                Profile
                <span className="hp-quickHint">
                  Manage your learning account
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section className="hp-section">
          <h2 className="hp-h2">
            How Our Flashcard Study App Works
          </h2>

          <div className="hp-steps">
            <div className="hp-step">
              <div className="hp-stepNum">1</div>
              <div className="hp-stepBody">
                <div className="hp-stepTitle">
                  Create Study Sets
                </div>
                <div className="hp-stepDesc">
                  Add questions and answers to build personalized digital
                  flashcards.
                </div>
              </div>
            </div>

            <div className="hp-step">
              <div className="hp-stepNum">2</div>
              <div className="hp-stepBody">
                <div className="hp-stepTitle">
                  Practice & Test Yourself
                </div>
                <div className="hp-stepDesc">
                  Use flashcard mode or quiz practice to strengthen retention.
                </div>
              </div>
            </div>

            <div className="hp-step">
              <div className="hp-stepNum">3</div>
              <div className="hp-stepBody">
                <div className="hp-stepTitle">
                  Improve & Track Progress
                </div>
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

            <Link
              to={hasToken ? "/sets" : "/signup"}
              className="hp-btn hp-btnPrimary"
            >
              {hasToken ? "Start Studying" : "Create Free Account"}
            </Link>
          </div>
        </section>
      </main>

      <footer className="hp-footer">
        <span>© {new Date().getFullYear()} Quiz-Ez</span>
      </footer>
    </div>
  );
}
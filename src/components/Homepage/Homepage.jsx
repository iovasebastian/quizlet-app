import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import axios from "../../utils/axiosInstance"; 
import './homepage.css';
import RequireAuth from "../RequireAuth/RequireAuth";

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

            <h1 className="hp-title">
              Study smarter with flashcards, quizzes, and progress tracking.
            </h1>

            <p className="hp-subtitle">
              Build question sets, practice quickly, see your stats improve, and explore sets in the marketplace.
            </p>

            <div className="hp-actions">
              {!hasToken ? (
                <>
                  <button className="hp-btn hp-btnPrimary" onClick={() => navigate("/signup")}>
                    Create account
                  </button>
                  <button className="hp-btn hp-btnGhost" onClick={() => navigate("/signin")}>
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  <button className="hp-btn hp-btnPrimary" onClick={() => navigate("/sets")}>
                    Go to Question Sets
                  </button>
                  <button className="hp-btn hp-btnGhost" onClick={() => navigate("/stats")}>
                    View Stats
                  </button>
                </>
              )}
            </div>

            <div className="hp-highlights">
              <div className="hp-highlight">
                <div className="hp-highlightTitle">Create sets</div>
                <div className="hp-highlightDesc">Add questions & answers fast.</div>
              </div>
              <div className="hp-highlight">
                <div className="hp-highlightTitle">Practice</div>
                <div className="hp-highlightDesc">Flashcards + quiz mode.</div>
              </div>
              <div className="hp-highlight">
                <div className="hp-highlightTitle">Track progress</div>
                <div className="hp-highlightDesc">See what you’ve mastered.</div>
              </div>
            </div>
          </div>

          <div className="hp-preview">
            <div className="hp-card">
              <div className="hp-cardTop">
                <span className="hp-pill">Flashcard</span>
                <span className="hp-pill hp-pillMuted">Preview</span>
              </div>

              <div className="hp-q">
                <div className="hp-qLabel">Question</div>
                <div className="hp-qText">What does a primary key do?</div>
              </div>

              <div className="hp-a">
                <div className="hp-qLabel">Answer</div>
                <div className="hp-aText">Uniquely identifies each row in a table.</div>
              </div>
            </div>

            <div className="hp-quickRow">
            <button className="hp-quick" onClick={hasToken ? () => navigate("/marketplace") : () => navigate("/signin")}>
                Marketplace
                <span className="hp-quickHint">Find new sets</span>
            </button>
            <button className="hp-quick" onClick={hasToken ? () => navigate("/profile") : () => navigate("/signin")}>
                Profile
                <span className="hp-quickHint">Manage account</span>
            </button>
            </div>
          </div>
        </section>

        <section className="hp-section">
          <h2 className="hp-h2">How it works</h2>
          <div className="hp-steps">
            <div className="hp-step">
              <div className="hp-stepNum">1</div>
              <div className="hp-stepBody">
                <div className="hp-stepTitle">Create</div>
                <div className="hp-stepDesc">Make a set with questions & answers.</div>
              </div>
            </div>

            <div className="hp-step">
              <div className="hp-stepNum">2</div>
              <div className="hp-stepBody">
                <div className="hp-stepTitle">Practice</div>
                <div className="hp-stepDesc">Use flashcards or quiz mode to learn.</div>
              </div>
            </div>

            <div className="hp-step">
              <div className="hp-stepNum">3</div>
              <div className="hp-stepBody">
                <div className="hp-stepTitle">Improve</div>
                <div className="hp-stepDesc">Check stats and focus on weak spots.</div>
              </div>
            </div>
          </div>

          <div className="hp-cta">
            <div>
              <div className="hp-ctaTitle">Ready to start?</div>
              <div className="hp-ctaDesc">Create your first set and practice in under a minute.</div>
            </div>
            <button
              className="hp-btn hp-btnPrimary"
              onClick={() => navigate(hasToken ? "/sets" : "/signin")}
            >
              {hasToken ? "Start learning" : "Sign in to begin"}
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

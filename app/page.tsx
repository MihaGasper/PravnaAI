"use client";

import { useState, useCallback, useEffect } from "react";
import { WelcomeScreen } from "@/components/pravna/WelcomeScreen";
import { TopBar } from "@/components/pravna/TopBar";
import { CategoryGrid, type Category } from "@/components/pravna/CategoryGrid";
import {
  GuidedIntake,
  type IntakeData,
} from "@/components/pravna/GuidedIntake";
import { ResultCard } from "@/components/pravna/ResultCard";
import { ToastContainer } from "@/components/pravna/Toast";

type Screen = "welcome" | "categories" | "intake" | "result";

const TRANSITION_MS = 350;

export default function PravnaAIPage() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [nextScreen, setNextScreen] = useState<Screen | null>(null);
  const [animState, setAnimState] = useState<"idle" | "exit" | "enter">("idle");
  const [mode, setMode] = useState<"simple" | "expert">("simple");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [, setIntakeData] = useState<IntakeData | null>(null);

  const navigate = useCallback(
    (to: Screen) => {
      if (animState !== "idle") return;
      setNextScreen(to);
      setAnimState("exit");
    },
    [animState]
  );

  useEffect(() => {
    if (animState === "exit") {
      const t = setTimeout(() => {
        setScreen(nextScreen!);
        setNextScreen(null);
        setAnimState("enter");
      }, TRANSITION_MS);
      return () => clearTimeout(t);
    }
    if (animState === "enter") {
      const t = setTimeout(() => {
        setAnimState("idle");
      }, TRANSITION_MS);
      return () => clearTimeout(t);
    }
  }, [animState, nextScreen]);

  const screenClass =
    animState === "exit"
      ? "screen-exit"
      : animState === "enter"
        ? "screen-enter"
        : "";

  const handleSelectMode = (selectedMode: "simple" | "expert") => {
    setMode(selectedMode);
    navigate("categories");
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    navigate("intake");
  };

  const handleIntakeSubmit = (data: IntakeData) => {
    setIntakeData(data);
    navigate("result");
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setIntakeData(null);
    navigate("welcome");
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    navigate("categories");
  };

  return (
    <main className="min-h-screen overflow-x-hidden">
      {screen !== "welcome" && <TopBar mode={mode} onReset={handleReset} />}

      <div className={screenClass}>
        {screen === "welcome" && (
          <WelcomeScreen onSelectMode={handleSelectMode} />
        )}

        {screen === "categories" && (
          <CategoryGrid onSelectCategory={handleSelectCategory} />
        )}

        {screen === "intake" && selectedCategory && (
          <GuidedIntake
            category={selectedCategory}
            onBack={handleBackToCategories}
            onSubmit={handleIntakeSubmit}
          />
        )}

        {screen === "result" && (
          <ResultCard onBack={handleBackToCategories} />
        )}
      </div>

      <ToastContainer />
    </main>
  );
}

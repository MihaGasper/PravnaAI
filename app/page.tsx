"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WelcomeScreen } from "@/components/pravna/WelcomeScreen";
import { TopBar } from "@/components/pravna/TopBar";
import { CategoryGrid, type Category } from "@/components/pravna/CategoryGrid";
import {
  GuidedIntake,
  type IntakeData,
} from "@/components/pravna/GuidedIntake";
import { ResultCard } from "@/components/pravna/ResultCard";
import { ToastContainer } from "@/components/pravna/Toast";
import { createClient } from "@/lib/supabase/client";
import { useConversation } from "@/hooks/use-conversation";

type Screen = "welcome" | "categories" | "intake" | "result";

const TRANSITION_MS = 350;

export default function PravnaAIPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("welcome");
  const [nextScreen, setNextScreen] = useState<Screen | null>(null);
  const [animState, setAnimState] = useState<"idle" | "exit" | "enter">("idle");
  const [mode, setMode] = useState<"simple" | "expert">("simple");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [intakeData, setIntakeData] = useState<IntakeData | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [fontLarge, setFontLarge] = useState(false);

  const { createConversation } = useConversation();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

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
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    setMode(selectedMode);
    navigate("categories");
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    navigate("intake");
  };

  const handleIntakeSubmit = async (data: IntakeData) => {
    setIntakeData(data);

    // Create conversation in database
    if (selectedCategory) {
      const conversation = await createConversation({
        title: `${selectedCategory.label} - ${data.role || 'Poizvedba'}`,
        category: selectedCategory.id,
        role: data.role,
        problem: data.problem,
        duration: data.duration,
        details: data.details,
      });

      if (conversation) {
        setConversationId(conversation.id);
      }
    }

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
      {screen !== "welcome" && (
        <TopBar
          mode={mode}
          onReset={handleReset}
          fontLarge={fontLarge}
          onToggleFont={() => setFontLarge(!fontLarge)}
        />
      )}

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

        {screen === "result" && selectedCategory && intakeData && (
          <ResultCard
            onBack={handleBackToCategories}
            conversationId={conversationId}
            category={selectedCategory}
            intakeData={intakeData}
          />
        )}
      </div>

      <ToastContainer />
    </main>
  );
}

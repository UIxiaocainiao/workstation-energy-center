import { createElement, type ComponentPropsWithoutRef, type ElementType, type Ref, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

type VariableSpeed = {
  min: number;
  max: number;
};

type TextTypeProps<T extends ElementType = "div"> = {
  text: string | string[];
  as?: T;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string;
  cursorClassName?: string;
  cursorBlinkDuration?: number;
  textColors?: string[];
  variableSpeed?: VariableSpeed;
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
  reverseMode?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

export function TextType<T extends ElementType = "div">({
  text,
  as,
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = "",
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = "|",
  cursorClassName = "",
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}: TextTypeProps<T>) {
  const Component = (as ?? "div") as ElementType;
  const [displayedText, setDisplayedText] = useState("");
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [typingSpeed, variableSpeed]);

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return "inherit";
    return textColors[currentTextIndex % textColors.length];
  };

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (!showCursor || !cursorRef.current) return undefined;
    gsap.set(cursorRef.current, { opacity: 1 });
    const tween = gsap.to(cursorRef.current, {
      opacity: 0,
      duration: cursorBlinkDuration,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });
    return () => {
      tween.kill();
    };
  }, [showCursor, cursorBlinkDuration]);

  useEffect(() => {
    if (!isVisible) return undefined;
    if (textArray.length === 0) return undefined;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const currentText = textArray[currentTextIndex] ?? "";
    const processedText = reverseMode ? currentText.split("").reverse().join("") : currentText;

    const tick = () => {
      if (isDeleting) {
        if (displayedText === "") {
          setIsDeleting(false);
          if (currentTextIndex === textArray.length - 1 && !loop) return;
          if (onSentenceComplete) onSentenceComplete(textArray[currentTextIndex] ?? "", currentTextIndex);
          setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
          setCurrentCharIndex(0);
          return;
        }
        timeoutId = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
        }, deletingSpeed);
        return;
      }

      if (currentCharIndex < processedText.length) {
        timeoutId = setTimeout(() => {
          setDisplayedText((prev) => prev + processedText[currentCharIndex]);
          setCurrentCharIndex((prev) => prev + 1);
        }, variableSpeed ? getRandomSpeed() : typingSpeed);
        return;
      }

      if (!loop && currentTextIndex === textArray.length - 1) return;
      timeoutId = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    };

    if (currentCharIndex === 0 && !isDeleting && displayedText === "") {
      timeoutId = setTimeout(tick, initialDelay);
    } else {
      tick();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    currentCharIndex,
    currentTextIndex,
    deletingSpeed,
    displayedText,
    getRandomSpeed,
    initialDelay,
    isDeleting,
    isVisible,
    loop,
    onSentenceComplete,
    pauseDuration,
    reverseMode,
    textArray,
    typingSpeed,
    variableSpeed,
  ]);

  const currentFullText = textArray[currentTextIndex] ?? "";
  const shouldHideCursor = hideCursorWhileTyping && (currentCharIndex < currentFullText.length || isDeleting);

  return createElement(
    Component,
    {
      ref: containerRef as Ref<HTMLElement>,
      className: `text-type ${className}`.trim(),
      ...props,
    },
    <span className="text-type__content" style={{ color: getCurrentTextColor() }}>
      {displayedText}
    </span>,
    showCursor ? (
      <span
        ref={cursorRef}
        className={`text-type__cursor ${cursorClassName} ${shouldHideCursor ? "text-type__cursor--hidden" : ""}`.trim()}
      >
        {cursorCharacter}
      </span>
    ) : null,
  );
}

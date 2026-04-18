import { useCallback, useEffect, type PropsWithChildren } from "react";
import { useRouter } from "next/router";

type AuthModalLayoutProps = PropsWithChildren<{
  closeTo?: string;
}>;

export function AuthModalLayout({ children, closeTo = "/" }: AuthModalLayoutProps) {
  const router = useRouter();

  const closeModal = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    void router.push(closeTo);
  }, [closeTo, router]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeModal]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <section
      className="auth-modal"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <div className="auth-modal__panel" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="auth-modal__close" onClick={closeModal} aria-label="Close auth modal">
          ×
        </button>
        {children}
      </div>
    </section>
  );
}

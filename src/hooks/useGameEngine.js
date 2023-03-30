import { useEffect, useRef } from "react";

const useGameEngine = (update) => {
  const rafRef = useRef();
  useEffect(() => {
    rafRef.current = requestAnimationFrame(function frame(currentTime) {
      update(currentTime);
      rafRef.current = requestAnimationFrame(frame);
    });
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [update]);
};

export { useGameEngine };

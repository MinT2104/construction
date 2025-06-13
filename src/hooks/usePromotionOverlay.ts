import { useState, useEffect } from "react";

const PROMOTION_OVERLAY_KEY = "promotion_overlay_closed";
const DISPLAY_INTERVAL = 30 * 60 * 1000; // 30 phút tính bằng milliseconds

export const usePromotionOverlay = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkShouldShow = () => {
      if (typeof window === "undefined") return;

      const lastClosedTime = localStorage.getItem(PROMOTION_OVERLAY_KEY);

      if (lastClosedTime === null) {
        // Nếu chưa có trong localStorage, hiển thị ngay
        setIsVisible(true);
        return;
      }

      const now = Date.now();
      const timeSinceLastClose = now - parseInt(lastClosedTime);

      // Hiển thị nếu đã qua 30 phút kể từ lần đóng cuối
      if (timeSinceLastClose >= DISPLAY_INTERVAL) {
        setIsVisible(true);
      }
    };

    checkShouldShow();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(PROMOTION_OVERLAY_KEY, Date.now().toString());
    }
  };

  return {
    isVisible,
    handleClose,
  };
};

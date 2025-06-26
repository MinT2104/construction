import { memo } from "react";

const CriticalCSS = memo(() => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          /* Critical CSS - Minimal to avoid Tailwind conflicts */
          
          /* Font optimization */
          body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-family: var(--font-roboto, system-ui, sans-serif);
          }
          
          /* Loading spinner for immediate feedback */
          .critical-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid #f3f4f6;
            border-top: 2px solid #059669;
            border-radius: 50%;
            animation: critical-spin 1s linear infinite;
          }
          
          @keyframes critical-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* Prevent FOUC */
          .font-loading {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          
          /* Image loading optimization */
          .img-skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: img-loading 1.5s infinite;
          }
          
          @keyframes img-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `,
      }}
    />
  );
});

CriticalCSS.displayName = "CriticalCSS";

export default CriticalCSS;

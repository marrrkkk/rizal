import { useState, useRef, useEffect } from "react";
import {
  useResponsive,
  getTouchFriendlyProps,
} from "../utils/responsiveUtils.jsx";
import { filipinoTheme } from "../theme/theme";

const TouchFriendlyDragDrop = ({
  items = [],
  dropZones = [],
  onDrop,
  onDragStart,
  onDragEnd,
  theme = "blue",
  className = "",
  itemClassName = "",
  dropZoneClassName = "",
  disabled = false,
}) => {
  const { isTouchDevice, isMobile } = useResponsive();
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);
  const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragPreviewRef = useRef(null);

  const getThemeColors = () => {
    const themeMap = {
      blue: filipinoTheme.colors.primary.blue,
      red: filipinoTheme.colors.primary.red,
      yellow: filipinoTheme.colors.primary.yellow,
      green: "from-emerald-400 to-green-600",
      purple: "from-purple-400 to-indigo-500",
      pink: "from-pink-400 to-rose-500",
    };
    return themeMap[theme] || themeMap.blue;
  };

  // Handle mouse drag events
  const handleMouseDragStart = (e, item) => {
    if (disabled) return;

    setDraggedItem(item);
    setIsDragging(true);

    if (onDragStart) {
      onDragStart(item);
    }
  };

  const handleMouseDragEnd = (e) => {
    setDraggedItem(null);
    setIsDragging(false);
    setDraggedOver(null);

    if (onDragEnd) {
      onDragEnd();
    }
  };

  const handleMouseDrop = (e, dropZone) => {
    e.preventDefault();

    if (draggedItem && onDrop) {
      onDrop(draggedItem, dropZone);
    }

    handleMouseDragEnd(e);
  };

  const handleMouseDragOver = (e, dropZone) => {
    e.preventDefault();
    setDraggedOver(dropZone);
  };

  const handleMouseDragLeave = () => {
    setDraggedOver(null);
  };

  // Handle touch drag events
  const handleTouchStart = (e, item) => {
    if (disabled) return;

    // Prevent default to avoid scrolling issues
    e.preventDefault();

    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setDraggedItem(item);

    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    if (onDragStart) {
      onDragStart(item);
    }
  };

  const handleTouchMove = (e) => {
    if (!draggedItem || disabled) return;

    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];

    if (!isDragging) {
      // Check if we've moved enough to start dragging (reduced threshold for better responsiveness)
      const deltaX = Math.abs(touch.clientX - touchStartPos.x);
      const deltaY = Math.abs(touch.clientY - touchStartPos.y);

      if (deltaX > 5 || deltaY > 5) {
        setIsDragging(true);
        // Add haptic feedback when drag starts
        if (navigator.vibrate) {
          navigator.vibrate(25);
        }
      }
    }

    if (isDragging && dragPreviewRef.current) {
      // Use requestAnimationFrame for smoother animations
      requestAnimationFrame(() => {
        if (dragPreviewRef.current) {
          // Update drag preview position with better centering
          dragPreviewRef.current.style.left = `${touch.clientX - 60}px`;
          dragPreviewRef.current.style.top = `${touch.clientY - 30}px`;
        }
      });

      // Throttle drop zone detection for better performance
      const now = Date.now();
      if (!this.lastDropZoneCheck || now - this.lastDropZoneCheck > 100) {
        this.lastDropZoneCheck = now;

        // Find drop zone under touch point
        const elementBelow = document.elementFromPoint(
          touch.clientX,
          touch.clientY
        );
        const dropZoneElement = elementBelow?.closest("[data-drop-zone]");

        if (dropZoneElement) {
          const dropZoneId = dropZoneElement.dataset.dropZone;
          const dropZone = dropZones.find((zone) => zone.id === dropZoneId);
          if (draggedOver?.id !== dropZone?.id) {
            setDraggedOver(dropZone);
            // Add haptic feedback when hovering over drop zone
            if (navigator.vibrate && dropZone) {
              navigator.vibrate(15);
            }
          }
        } else {
          setDraggedOver(null);
        }
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (!draggedItem || disabled) return;

    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    );
    const dropZoneElement = elementBelow?.closest("[data-drop-zone]");

    if (dropZoneElement && isDragging) {
      const dropZoneId = dropZoneElement.dataset.dropZone;
      const dropZone = dropZones.find((zone) => zone.id === dropZoneId);

      if (dropZone && onDrop) {
        // Add success haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate([50, 50, 50]);
        }
        onDrop(draggedItem, dropZone);
      }
    } else if (isDragging) {
      // Add failure haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
    }

    // Clean up with animation
    if (dragPreviewRef.current) {
      dragPreviewRef.current.style.transition = "all 0.2s ease";
      dragPreviewRef.current.style.opacity = "0";
      dragPreviewRef.current.style.transform = "scale(0.8)";
    }

    setTimeout(() => {
      setDraggedItem(null);
      setIsDragging(false);
      setDraggedOver(null);
    }, 200);

    if (onDragEnd) {
      onDragEnd();
    }
  };

  // Touch-friendly props
  const touchProps = getTouchFriendlyProps(isTouchDevice);

  return (
    <div className={`relative ${className}`}>
      {/* Draggable Items */}
      <div
        className={`grid gap-3 ${
          isMobile ? "grid-cols-2" : "grid-cols-3 md:grid-cols-4"
        } mb-6`}
      >
        {items.map((item) => (
          <div
            key={item.id}
            draggable={!isTouchDevice && !disabled}
            onDragStart={(e) => handleMouseDragStart(e, item)}
            onDragEnd={handleMouseDragEnd}
            onTouchStart={(e) => handleTouchStart(e, item)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`
              group relative cursor-move select-none
              ${isTouchDevice ? "active:scale-95" : "hover:scale-105"}
              transition-all duration-200
              ${draggedItem?.id === item.id ? "opacity-50 scale-95" : ""}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              ${itemClassName}
            `}
            {...touchProps}
          >
            <div
              className={`
              p-4 rounded-xl shadow-md border-2 border-transparent
              bg-gradient-to-br ${getThemeColors()}
              text-white font-semibold text-center
              ${isTouchDevice ? "min-h-[60px]" : "min-h-[50px]"}
              flex items-center justify-center
              group-hover:shadow-lg
              ${
                draggedItem?.id === item.id
                  ? "ring-2 ring-white ring-opacity-50"
                  : ""
              }
            `}
            >
              {item.content || item.text || item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Drop Zones */}
      <div
        className={`grid gap-4 ${
          isMobile ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3"
        }`}
      >
        {dropZones.map((zone) => (
          <div
            key={zone.id}
            data-drop-zone={zone.id}
            onDrop={(e) => handleMouseDrop(e, zone)}
            onDragOver={(e) => handleMouseDragOver(e, zone)}
            onDragLeave={handleMouseDragLeave}
            className={`
              relative p-6 rounded-xl border-2 border-dashed
              ${isTouchDevice ? "min-h-[80px]" : "min-h-[100px]"}
              flex items-center justify-center text-center
              transition-all duration-200
              ${
                draggedOver?.id === zone.id
                  ? "border-green-400 bg-green-50 scale-105"
                  : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
              }
              ${zone.filled ? "bg-green-100 border-green-300" : ""}
              ${dropZoneClassName}
            `}
          >
            <div className="w-full">
              {zone.filled ? (
                <div
                  className={`
                  p-3 rounded-lg bg-gradient-to-br ${getThemeColors()}
                  text-white font-semibold shadow-md
                `}
                >
                  {zone.content || zone.label}
                </div>
              ) : (
                <div className="text-gray-500 font-medium">
                  {zone.placeholder || `Drop here: ${zone.label}`}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Touch Drag Preview */}
      {isTouchDevice && isDragging && draggedItem && (
        <div
          ref={dragPreviewRef}
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: 0, top: 0 }}
        >
          <div
            className={`
            p-3 rounded-lg shadow-2xl border-2 border-white
            bg-gradient-to-br ${getThemeColors()}
            text-white font-semibold text-sm
            opacity-90 scale-110
          `}
          >
            {draggedItem.content || draggedItem.text || draggedItem.label}
          </div>
        </div>
      )}

      {/* Instructions for touch devices */}
      {isTouchDevice && items.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 text-center">
            📱 <strong>Touch & Drag:</strong> Press and hold an item, then drag
            it to the correct zone
          </p>
        </div>
      )}
    </div>
  );
};

export default TouchFriendlyDragDrop;

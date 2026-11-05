p = 'artifacts/rynas-wardrobe/src/components/interactive/Atelier360Viewer.tsx'
with open(p, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update isAutoPlaying initial state to true
text = text.replace(
    '  const [isAutoPlaying, setIsAutoPlaying] = useState(isVideoMode);',
    '  const [isAutoPlaying, setIsAutoPlaying] = useState(true);'
)

# 2. Add preloading & update interval to 450ms
target_auto_spin = '''  // Photo Auto-orbit loop (only in photo mode)
  useEffect(() => {
    if (isVideoMode || !isAutoPlaying || activeAngles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAngles.length);
    }, 1400);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isVideoMode, activeAngles.length]);'''

replacement_auto_spin = '''  // Preload all angle images for instantaneous, 0ms rotation
  useEffect(() => {
    activeAngles.forEach((a) => {
      if (a.image && typeof window !== "undefined") {
        const img = new window.Image();
        img.src = a.image;
      }
    });
  }, [activeAngles]);

  // Photo Auto-orbit loop (smooth 450ms per perspective)
  useEffect(() => {
    if (isVideoMode || !isAutoPlaying || activeAngles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAngles.length);
    }, 450);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isVideoMode, activeAngles.length]);'''

if target_auto_spin in text:
    text = text.replace(target_auto_spin, replacement_auto_spin)
    print('Updated auto spin and added preloading!')
else:
    print('target_auto_spin not found')

# 3. Update pointer handlers
target_pointer = '''  // Pointer down (mouse / touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setIsAutoPlaying(false);
    startXRef.current = e.clientX;

    if (isVideoMode && videoRef.current) {
      videoRef.current.pause();
      startProgressRef.current = videoProgress;
    } else {
      startIndexRef.current = currentIndex;
    }
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  // Pointer move (scrubbing)
  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - startXRef.current;

      if (isVideoMode && videoRef.current && videoRef.current.duration) {
        const containerW = containerRef.current?.offsetWidth || 600;
        // Dragging full container width scrubs full 360 circle
        const progressDelta = -deltaX / containerW;
        let newProgress = (startProgressRef.current + progressDelta) % 1;
        if (newProgress < 0) newProgress += 1;
        videoRef.current.currentTime = newProgress * videoRef.current.duration;
        setVideoProgress(newProgress);
      } else if (activeAngles.length > 0) {
        const stepSensitivity = 38;
        const steps = Math.floor(deltaX / stepSensitivity);
        let newIdx = (startIndexRef.current - steps) % activeAngles.length;
        if (newIdx < 0) newIdx += activeAngles.length;
        setCurrentIndex(newIdx);
      }
    } else if (isZoomed && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    }
  };'''

replacement_pointer = '''  // Pointer down (mouse / touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setIsAutoPlaying(false);
    startXRef.current = e.clientX;

    if (isVideoMode && videoRef.current) {
      videoRef.current.pause();
      startProgressRef.current = videoProgress;
    } else {
      startIndexRef.current = currentIndex;
    }
    try {
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {}
  };

  // Pointer move (continuous smooth scrubbing)
  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - startXRef.current;

      if (isVideoMode && videoRef.current && videoRef.current.duration) {
        const containerW = containerRef.current?.offsetWidth || 600;
        const progressDelta = -deltaX / containerW;
        let newProgress = (startProgressRef.current + progressDelta) % 1;
        if (newProgress < 0) newProgress += 1;
        videoRef.current.currentTime = newProgress * videoRef.current.duration;
        setVideoProgress(newProgress);
      } else if (activeAngles.length > 0) {
        const stepSensitivity = 22; // 22px of horizontal drag moves to next angle
        const steps = Math.trunc(deltaX / stepSensitivity);
        if (steps !== 0) {
          setCurrentIndex((prev) => {
            let next = (prev - steps) % activeAngles.length;
            if (next < 0) next += activeAngles.length;
            return next;
          });
          startXRef.current = e.clientX;
        }
      }
    } else if (isZoomed && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    }
  };'''

if target_pointer in text:
    text = text.replace(target_pointer, replacement_pointer)
    print('Updated pointer handlers!')
else:
    print('target_pointer not found')

# 4. Add touchAction: none and direct img tag for 0ms frame rendering
target_canvas = '''      {/* Main 360° Canvas Area with Drag Gesture */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative w-full h-[420px] sm:h-[480px] bg-[#1C1817] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing ${
          isDragging ? "cursor-grabbing" : ""
        }`}
      >'''

replacement_canvas = '''      {/* Main 360° Canvas Area with Drag Gesture */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: "none" }}
        className={`relative w-full h-[420px] sm:h-[480px] bg-[#FAF8F5] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing ${
          isDragging ? "cursor-grabbing" : ""
        }`}
      >'''

if target_canvas in text:
    text = text.replace(target_canvas, replacement_canvas)
    print('Added touchAction none to canvas!')

target_img = '''            {currentAngle.image && (
              <Image
                src={currentAngle.image}
                alt={`${productName} - ${currentAngle.label}`}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-contain pointer-events-none transition-opacity duration-150"
                priority
              />
            )}'''

replacement_img = '''            {currentAngle.image && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={currentAngle.image}
                alt={`${productName} - ${currentAngle.label}`}
                className="w-full h-full object-contain pointer-events-none select-none"
                draggable={false}
              />
            )}'''

if target_img in text:
    text = text.replace(target_img, replacement_img)
    print('Replaced Image with native 0ms img!')

with open(p, 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated Atelier360Viewer.tsx successfully!')


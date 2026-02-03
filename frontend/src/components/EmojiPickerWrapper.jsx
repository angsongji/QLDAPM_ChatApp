import { useState, useRef, useEffect } from "react";
import { useThemeStore } from "../store/useThemeStore";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiWinkFill } from "react-icons/bs";
function EmojiPickerWrapper({ setMessage }) {
  const emojiPickerWrapperRef = useRef(null);
  const theme = useThemeStore((state) => state.theme);
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + "" + emojiData.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerWrapperRef.current &&
        !emojiPickerWrapperRef.current.contains(event.target)
      ) {
        setShowPicker(false); // close if click outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={emojiPickerWrapperRef}
      className="flex flex-col items-center justify-center relative"
    >
      <div
        className={`h-[50vh] md:h-[60vh] w-auto absolute -top-3 left-1/2 -translate-y-[100%] -translate-x-1/5 ${
          showPicker ? "block" : "hidden"
        }`}
      >
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          emojiStyle="native"
          theme={["light", "cupcake"].includes(theme) ? "light" : "dark"}
          width="100%"
          height="100%"
          previewConfig={{
            showPreview: false,
          }}
        />
      </div>
      <button
        type="button"
        className="cursor-pointer relative"
        onClick={() => {
          setShowPicker((prev) => !prev);
        }}
      >
        <BsEmojiWinkFill size={22} className="" />
      </button>
    </div>
  );
}

export default EmojiPickerWrapper;

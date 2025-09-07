import { createPlaceholderImage } from "../utils/placeholderContent";

export default function PlaceholderImage({
  type,
  imageKey,
  size = "large",
  alt = "Educational content",
  className = "",
  showDescription = false,
  onClick = null,
}) {
  const placeholder = createPlaceholderImage(type, imageKey, size);

  return (
    <div
      className={`${placeholder.className} ${className} ${
        onClick ? "cursor-pointer hover:scale-105 transition-transform" : ""
      }`}
      onClick={onClick}
      title={alt || placeholder.description}
    >
      <div className="text-center">
        <div className="mb-2">{placeholder.emoji}</div>
        {showDescription && (
          <div className="text-xs text-gray-600 px-2 leading-tight">
            {placeholder.description}
          </div>
        )}
      </div>
    </div>
  );
}

// Specialized placeholder components for common use cases
export function CharacterPlaceholder({
  character,
  size = "medium",
  showName = true,
  onClick = null,
}) {
  const placeholder = createPlaceholderImage("characters", character, size);
  const name = character
    .replace("_", " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div
      className={`${placeholder.className} ${
        onClick ? "cursor-pointer hover:scale-105 transition-transform" : ""
      }`}
      onClick={onClick}
    >
      <div className="text-center">
        <div className="mb-2">{placeholder.emoji}</div>
        {showName && (
          <div className="text-xs font-medium text-gray-700 px-1">{name}</div>
        )}
      </div>
    </div>
  );
}

export function ScenePlaceholder({
  scene,
  size = "large",
  showTitle = true,
  title = null,
}) {
  const placeholder = createPlaceholderImage("scenes", scene, size);
  const sceneTitle =
    title || scene.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className={placeholder.className}>
      <div className="text-center">
        <div className="mb-2">{placeholder.emoji}</div>
        {showTitle && (
          <div className="text-sm font-medium text-gray-700 px-2">
            {sceneTitle}
          </div>
        )}
      </div>
    </div>
  );
}

export function ObjectPlaceholder({ object, size = "medium", label = null }) {
  const placeholder = createPlaceholderImage("objects", object, size);
  const objectLabel =
    label || object.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className={placeholder.className}>
      <div className="text-center">
        <div className="mb-1">{placeholder.emoji}</div>
        {label !== false && (
          <div className="text-xs text-gray-600 px-1">{objectLabel}</div>
        )}
      </div>
    </div>
  );
}

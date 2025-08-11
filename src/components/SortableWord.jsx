import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export function SortableWord({ id, word }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 'auto',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow"
      {...attributes}
      {...listeners}
    >
      {word}
    </div>
  )
}

export default SortableWord

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export function SortableItem({ id, number, text, isCorrect, showResult, disabled }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 'auto',
  }

  // Determine background and border colors based on state
  const getBackgroundColor = () => {
    if (!showResult) return 'bg-white'
    return isCorrect ? 'bg-green-50' : 'bg-red-50'
  }

  const getBorderColor = () => {
    if (!showResult) return 'border-gray-200 hover:border-blue-300'
    return isCorrect ? 'border-green-300' : 'border-red-300'
  }

  const getTextColor = () => {
    if (!showResult) return 'text-gray-800'
    return isCorrect ? 'text-green-800' : 'text-red-800'
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 rounded-lg border-2 ${getBorderColor()} ${getBackgroundColor()} shadow-sm hover:shadow-md transition-all duration-200 cursor-move ${
        disabled ? 'opacity-70 cursor-not-allowed' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold ${
          showResult 
            ? isCorrect 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {number}
        </div>
        <div className={`flex-1 ${getTextColor()}`}>
          {text}
          {showResult && !isCorrect && (
            <div className="mt-1 text-xs text-red-600">
              {isCorrect ? '✓ Correct position' : '✗ Incorrect position'}
            </div>
          )}
        </div>
        {!disabled && (
          <div className="ml-2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}

export default SortableItem

import { useState, useCallback, useEffect } from "react"
import { useDrop, useDrag } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { DndProvider } from "react-dnd"

export default function TravelMapGame({ onComplete }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <TravelMapGameContent onComplete={onComplete} />
    </DndProvider>
  )
}

function TravelMapGameContent({ onComplete }) {
  const [cities, setCities] = useState([
    { id: 1, name: "Barcelona", x: 50, y: 200, placed: false },
    { id: 2, name: "Madrid", x: 25, y: 250, placed: false },
    { id: 3, name: "Paris", x: 150, y: 150, placed: false },
    { id: 4, name: "Heidelberg", x: 250, y: 170, placed: false },
    { id: 5, name: "Berlin", x: 300, y: 150, placed: false },
    { id: 6, name: "Brussels", x: 180, y: 140, placed: false },
    { id: 7, name: "Ghent", x: 160, y: 160, placed: false },
  ])

  const [targets, setTargets] = useState([
    { id: 1, name: "Barcelona", x: 600, y: 200, correct: false },
    { id: 2, name: "Madrid", x: 550, y: 250, correct: false },
    { id: 3, name: "Paris", x: 500, y: 180, correct: false },
    { id: 4, name: "Heidelberg", x: 600, y: 180, correct: false },
    { id: 5, name: "Berlin", x: 650, y: 160, correct: false },
    { id: 6, name: "Brussels", x: 520, y: 160, correct: false },
    { id: 7, name: "Ghent", x: 500, y: 150, correct: false },
  ])

  const [selectedCity, setSelectedCity] = useState(null)
  const [showInfo, setShowInfo] = useState(null)
  const [completed, setCompleted] = useState(false)

  const [{ isOver }, drop] = useDrop({
    accept: "city",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset()
      if (!offset) return
      
      const dropX = offset.x - 400 // Adjust for map position
      const dropY = offset.y - 100 // Adjust for map position
      
      // Find the closest target
      let closestTarget = null
      let minDistance = Infinity
      
      targets.forEach(target => {
        if (!target.correct) {
          const dx = target.x - dropX
          const dy = target.y - dropY
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < minDistance && distance < 100) { // 100px tolerance
            minDistance = distance
            closestTarget = target
          }
        }
      })
      
      if (closestTarget && closestTarget.name === item.name) {
        // Correct placement
        setTargets(prev => 
          prev.map(t => 
            t.id === closestTarget.id 
              ? { ...t, correct: true } 
              : t
          )
        )
        
        setCities(prev => 
          prev.map(c => 
            c.id === item.id 
              ? { ...c, placed: true, x: closestTarget.x, y: closestTarget.y } 
              : c
          )
        )
        
        // Check if all cities are placed correctly
        const allCorrect = targets.every(t => t.correct || t.name === item.name)
        if (allCorrect) {
          setCompleted(true)
          onComplete()
        }
        
        return { name: closestTarget.name }
      }
      
      // Return to original position if dropped incorrectly
      return { name: null }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  const handleCityClick = (city) => {
    setSelectedCity(city)
    setShowInfo(true)
  }

  const cityInfo = {
    "Barcelona": "Rizal's first stop in Europe in 1882. He was fascinated by the city's architecture and culture.",
    "Madrid": "Where Rizal studied medicine and philosophy at the Universidad Central de Madrid from 1882-1885.",
    "Paris": "Studied ophthalmology under Dr. Louis de Weckert in 1885-1886. Met fellow reformists here.",
    "Heidelberg": "Studied at the University of Heidelberg in 1886. Wrote his famous poem 'To the Flowers of Heidelberg'.",
    "Berlin": "Completed and published 'Noli Me Tangere' in 1887 with the help of Maximo Viola.",
    "Brussels": "Wrote articles for La Solidaridad and worked on 'El Filibusterismo' in 1890.",
    "Ghent": "Completed 'El Filibusterismo' in 1891 due to lower printing costs compared to Brussels."
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Rizal's European Journey Map</h2>
      
      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-800">
          {completed 
            ? "Congratulations! You've placed all the cities correctly!"
            : "Drag each city to its correct location on the map of Europe. Click on a city to learn more about Rizal's time there."
          }
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div 
            ref={drop}
            className="relative bg-blue-100 rounded-lg overflow-hidden border-2 border-blue-300"
            style={{ height: '500px', backgroundImage: 'url("/europe-map.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            {/* Drop targets */}
            {targets.map((target) => (
              <div 
                key={target.id}
                className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  target.correct ? 'bg-green-500' : 'bg-blue-500 opacity-70'
                }`}
                style={{
                  left: `${target.x}px`,
                  top: `${target.y}px`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer'
                }}
                onClick={() => target.correct && handleCityClick(target.name)}
              >
                {target.correct ? '✓' : target.id}
              </div>
            ))}
            
            {/* Placed cities */}
            {cities
              .filter(city => city.placed)
              .map((city) => (
                <div 
                  key={city.id}
                  className="absolute bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center"
                  style={{
                    left: `${city.x}px`,
                    top: `${city.y}px`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                  onClick={() => handleCityClick(city.name)}
                >
                  {city.name}
                </div>
              ))}
          </div>
        </div>
        
        <div className="w-full lg:w-64">
          <h3 className="font-semibold mb-3">Cities to Place:</h3>
          <div className="space-y-2">
            {cities
              .filter(city => !city.placed)
              .map((city) => (
                <DraggableCity 
                  key={city.id} 
                  city={city} 
                  onClick={() => handleCityClick(city.name)}
                />
              ))}
          </div>
          
          {showInfo && selectedCity && (
            <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-semibold">{selectedCity}</h4>
                <button 
                  onClick={() => setShowInfo(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-700">{cityInfo[selectedCity]}</p>
            </div>
          )}
        </div>
      </div>
      
      {completed && (
        <div className="mt-6 text-center">
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}

function DraggableCity({ city, onClick }) {
  const [{ isDragging }, drag] = useDrag({
    type: "city",
    item: { id: city.id, name: city.name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  return (
    <div
      ref={drag}
      onClick={onClick}
      className={`p-3 bg-blue-100 border border-blue-300 rounded-md cursor-move hover:bg-blue-200 transition-colors ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      {city.name}
    </div>
  )
}

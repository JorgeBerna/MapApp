import { AppLayout } from './Layout/index'
import './App.css'

function App() {
  return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="text-center bg-black/20 backdrop-blur-sm rounded-lg p-8 border border-white/10">
          <h1 className="text-4xl font-bold mb-6">MapApp</h1>
          <p className="text-lg mb-4 opacity-90">
            Explora el mundo y registra tus viajes
          </p>
        </div>
      </div>
    </AppLayout>
  )
}

export default App

import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import Button from '../components/common/Button'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 animate-fade-in">
      {/* Big 404 */}
      <div className="relative mb-6">
        <p className="font-display text-[120px] font-bold leading-none text-border select-none">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="text-3xl">🔍</span>
          </div>
        </div>
      </div>

      <h1 className="font-display text-2xl font-bold text-text-base mb-2">
        Page not found
      </h1>
      <p className="text-text-muted text-sm max-w-xs leading-relaxed mb-8">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>

      <div className="flex gap-3">
        <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(-1)}>
          Go back
        </Button>
        <Button variant="primary" icon={Home} onClick={() => navigate('/')}>
          Home
        </Button>
      </div>
    </div>
  )
}
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <div className="relative flex items-center justify-center">
        {/* Анимированный фон */}
        <div className="absolute w-32 h-32 rounded-full bg-primary/20 animate-ping" />
        
        {/* Центральный круг */}
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary via-accent to-secondary p-1 animate-pulse">
          <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Y
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-lg font-medium text-muted-foreground animate-pulse">
          Loading dreams...
        </p>
        {/* Простой прогресс-бар на чистом Tailwind */}
        <div className="mt-4 w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-[loading_1.5s_infinite_ease-in-out]" 
               style={{ width: '100%', transformOrigin: 'left' }} />
        </div>
      </div>
    </div>
  )
}
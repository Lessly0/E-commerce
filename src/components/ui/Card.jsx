export default function Card({ className = '', children, hover = false }) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow ${
        hover ? 'hover:shadow-md' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

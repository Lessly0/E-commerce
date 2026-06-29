import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`}>
      <Card className="flex h-full flex-col gap-2 transition-shadow hover:shadow-md">
        <img
          src={product.image}
          alt={product.title}
          className="aspect-square w-full rounded-lg object-cover bg-gray-100"
        />
        <h3 className="line-clamp-2 text-sm font-medium text-gray-900">{product.title}</h3>
        <p className="font-semibold text-brand-700">${product.price?.toFixed(2)}</p>
      </Card>
    </Link>
  )
}

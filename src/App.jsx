import { useSelector } from 'react-redux'
import SearchForm from './components/SearchForm.jsx'
import BrandList from './components/BrandList.jsx'
import OffersTable from './components/OffersTable.jsx'

export default function App() {
  const selectedBrand = useSelector((state) => state.search.selectedBrand)

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Поиск автозапчастей и аналогов</h1>
      <SearchForm />
      <BrandList />
      {/* key сбрасывает счётчик показанных строк при смене бренда */}
      <OffersTable key={selectedBrand} />
    </div>
  )
}

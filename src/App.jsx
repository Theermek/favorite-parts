import SearchForm from './components/SearchForm.jsx'
import BrandList from './components/BrandList.jsx'

export default function App() {
  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Поиск автозапчастей и аналогов</h1>
      <SearchForm />
      <BrandList />
    </div>
  )
}

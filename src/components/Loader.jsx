export default function Loader({ text = 'Загрузка…' }) {
  return (
    <div className="d-flex align-items-center gap-2 text-secondary my-3">
      <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
      <span>{text}</span>
    </div>
  )
}

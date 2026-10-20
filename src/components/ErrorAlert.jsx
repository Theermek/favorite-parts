export default function ErrorAlert({ message }) {
  return (
    <div className="alert alert-danger my-3" role="alert">
      {message}
    </div>
  )
}

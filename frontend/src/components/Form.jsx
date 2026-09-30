export default function Form({ title, children, onSubmit }) {
  return (
    <form className="form" onSubmit={onSubmit}>
      <h2>{title}</h2>
      {children}
    </form>
  );
}

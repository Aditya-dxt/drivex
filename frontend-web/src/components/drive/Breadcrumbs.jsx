function Breadcrumbs({ path, onNavigate }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      {path.map((p, index) => (
        <span
          key={p.id || "root"}
          style={{ cursor: "pointer" }}
          onClick={() => onNavigate(p.id)}
        >
          {p.name}
          {index < path.length - 1 && " > "}
        </span>
      ))}
    </div>
  );
}

export default Breadcrumbs;
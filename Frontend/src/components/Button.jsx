export default function Button({
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  onClick,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`button button--${variant}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
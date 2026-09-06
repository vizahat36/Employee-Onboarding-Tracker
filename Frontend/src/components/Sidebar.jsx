import { NavLink } from 'react-router-dom'

export default function Sidebar({ items = [] }) {
  return (
    <nav className="sidebar" aria-label="Application navigation">
      <ul className="sidebar__list">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} className="sidebar__link">
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
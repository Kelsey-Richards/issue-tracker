
import { NavLink } from 'react-router'

// Navigation link to the main issues page
export function NavBar() {
  return (
    <nav aria-label="Main">
      <NavLink to="/" end>
        Issues
      </NavLink>
    </nav>
  )
}

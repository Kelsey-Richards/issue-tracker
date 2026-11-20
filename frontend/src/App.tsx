
import { Outlet, Route, Routes, useNavigate } from 'react-router'
import { NavBar } from './components/NavBar'
import { IssueEditPage } from './pages/IssueEditPage'
import { IssueListPage } from './pages/IssueListPage'
import { NotFoundPage } from './pages/NotFoundPage'

// Display the header and navigation on every page
function Layout() {
  return (
    <>
      <header>
        <h1>Issue Tracker</h1>
        <NavBar />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

// Navigate to the edit page when someone clicks View
function ListRoute() {
  const navigate = useNavigate()
  return <IssueListPage onSelect={(id) => navigate(`/edit/${id}`)} />
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ListRoute />} />
        <Route path="edit/:id" element={<IssueEditPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

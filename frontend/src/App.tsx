import { Outlet, Route, Routes, useNavigate } from 'react-router'
import { NavBar } from './components/NavBar'
import { IssueEditPage } from './pages/IssueEditPage'
import { IssueListPage } from './pages/IssueListPage'
import { NotFoundPage } from './pages/NotFoundPage'

// Display the header and navigation on every page
function Layout() {
  return (
    <>
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">BugHive</p>
            <h1 className="text-xl font-semibold">Issue Tracker</h1>
            <p className="text-sm text-muted-foreground">
              Spot it. Track it. Fix it.
            </p>
          </div>
          <NavBar />
        </div>
      </header>
      <main className="mx-auto max-w-4xl p-4">
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

import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { HomePage } from '@/pages/HomePage'
import { CatalogPage } from '@/pages/CatalogPage'
import { TitleDetailPage } from '@/pages/TitleDetailPage'
import { ReaderPage } from '@/pages/ReaderPage'
import { LibraryPage } from '@/pages/LibraryPage'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { SettingsPage } from '@/pages/SettingsPage'
import { CommunityPage } from '@/pages/CommunityPage'
import { RankingPage } from '@/pages/RankingPage'
import { VipPage } from '@/pages/VipPage'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminTitlesPage } from '@/pages/admin/AdminTitlesPage'
import { AdminTitleFormPage } from '@/pages/admin/AdminTitleFormPage'
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage'
import { AdminReportsPage } from '@/pages/admin/AdminReportsPage'
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage'
import { AdminLogsPage } from '@/pages/admin/AdminLogsPage'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center animate-fade-in">
      <h1 className="font-display text-3xl font-bold text-wolf-white">{title}</h1>
      <p className="mt-4 text-wolf-white/50">Esta página será implementada nas próximas etapas.</p>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/read/:slug/:chapter',
    element: <ReaderPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireRole={['admin', 'superadmin', 'moderator', 'uploader']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'titles', element: <AdminTitlesPage /> },
      { path: 'titles/new', element: <AdminTitleFormPage /> },
      { path: 'titles/:id', element: <AdminTitleFormPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'reports', element: <AdminReportsPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
      { path: 'logs', element: <AdminLogsPage /> },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'latest', element: <CatalogPage /> },
      { path: 'ranking', element: <RankingPage /> },
      { path: 'novels', element: <CatalogPage /> },
      { path: 'community', element: <CommunityPage /> },
      { path: 'vip', element: <VipPage /> },
      { path: 'title/:slug', element: <TitleDetailPage /> },
      {
        path: 'library',
        element: (
          <ProtectedRoute>
            <LibraryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'favorites',
        element: (
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'history',
        element: (
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      { path: 'profile/:username', element: <ProfilePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

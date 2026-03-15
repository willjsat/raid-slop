import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { LandingPage } from './routes/LandingPage';
import { PlannerPage } from './routes/PlannerPage';
import { PublicPlanPage } from './routes/PublicPlanPage';
import { AboutPage } from './routes/AboutPage';

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/planner/:bossSlug', element: <PlannerPage /> },
  { path: '/plan/:planId', element: <PublicPlanPage /> },
  { path: '/about', element: <AboutPage /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

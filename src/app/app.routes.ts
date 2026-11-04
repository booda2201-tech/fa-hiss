import { Routes } from '@angular/router';

const BRAND = 'HISS | المعهد العالي للدراسات النوعية';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: BRAND,
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'about',
    title: `About | ${BRAND}`,
    loadComponent: () => import('./features/about/about.page').then((m) => m.AboutPage),
  },
  {
    path: 'admission',
    title: `Admission | ${BRAND}`,
    loadComponent: () => import('./features/admission/admission.page').then((m) => m.AdmissionPage),
  },
  {
    path: 'departments/:slug',
    title: `Departments | ${BRAND}`,
    loadComponent: () => import('./features/departments/department.page').then((m) => m.DepartmentPage),
  },
  {
    path: 'contact',
    title: `Contact | ${BRAND}`,
    loadComponent: () => import('./features/contact/contact.page').then((m) => m.ContactPage),
  },
  {
    path: 'student-portal',
    title: `Student Portal | ${BRAND}`,
    loadComponent: () => import('./features/portal/portal.page').then((m) => m.PortalPage),
  },
  {
    path: 'pages/:slug',
    title: `Info | ${BRAND}`,
    loadComponent: () => import('./features/info/info.page').then((m) => m.InfoPage),
  },
  { path: 'departments', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];

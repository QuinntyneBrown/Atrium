import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'documents', pathMatch: 'full' },
  {
    path: 'documents',
    loadComponent: () =>
      import(
        './documents/document-workspace/document-workspace.component'
      ).then((m) => m.DocumentWorkspaceComponent),
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./chat/chat-workspace/chat-workspace.component').then(
        (m) => m.ChatWorkspaceComponent,
      ),
  },
];

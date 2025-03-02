import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <header class="app-header">
      <h1>MovieTracker</h1>
      <nav>
        <a routerLink="/search" routerLinkActive="active">Search</a>
        <a routerLink="/watchlist" routerLinkActive="active">Want to Watch</a>
        <a routerLink="/in-progress" routerLinkActive="active">In Progress</a>
        <a routerLink="/watched" routerLinkActive="active">Watched</a>
      </nav>
    </header>
    
    <main class="content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .app-header {
      background-color: #1976d2;
      color: white;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }
    
    h1 {
      margin: 0;
      font-size: 24px;
    }
    
    nav {
      margin-top: 16px;
      display: flex;
      gap: 16px;
    }
    
    nav a {
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    
    nav a:hover, nav a.active {
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    .content {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class AppComponent {
  title = 'MovieTracker';
}

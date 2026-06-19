import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  b = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      // Auth pages (login / register) render without the app chrome.
      const url = this.router.url;
      this.b = url.includes('/login') || url.includes('/register');
    });
  }
}


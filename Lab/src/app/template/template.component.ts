import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/shared/services/layout.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  sidebarOpen = false;

  constructor(private layoutService: LayoutService) {}

  ngOnInit(): void {
    this.layoutService.sidebarOpen$.subscribe(open => {
      this.sidebarOpen = open;
    });
  }

  onSidebarOpenedChange(open: boolean): void {
    this.layoutService.setSidebarOpen(open);
  }
}


import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Output ('viewSidebar') sidebarIcon = new EventEmitter();
  isExpanded: boolean = false;
  viewSidebarIcon!: boolean;
  showNavLabels: boolean = true;

  constructor() { }

  ngOnInit(): void {
    this.viewSidebarIcon = true;
  }

  sideNavIcons(){
    this.viewSidebarIcon = !this.viewSidebarIcon;
    this.sidebarIcon.emit(!this.viewSidebarIcon);
  }

  toggle(sidenavbar:any, ev:any) {
    ev.stopImmediatePropagation();
    sidenavbar.toggle();
  }

}

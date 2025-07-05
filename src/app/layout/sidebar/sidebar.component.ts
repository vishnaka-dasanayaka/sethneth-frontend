import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { SelectItem } from "primeng/api";
import { filter } from "rxjs";

interface MenuItem {
  label: string;
  value: number;
  path: string;
}

@Component({
  selector: "app-sidebar",
  standalone: false,
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css",
})
export class SidebarComponent implements OnInit {
  currentMenu: number = 1;
  role: string = "";
  menuItems: MenuItem[] = [];
  currentPath: string = "";
  isSidebarOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getRole();

    this.currentPath = this.router.url;
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentPath = event.urlAfterRedirects;
      });
  }

  getRole() {
    this.role = "ADMIN"; // localStorage.getItem("role") || "";
    this.setMenuItems();
  }

  onClickMenu(path: string, value: number) {
    this.currentMenu = value;
    this.isSidebarOpen = false;
    this.router.navigate([path]);
  }

  setMenuItems() {
    this.menuItems = [
      { label: "Dashboard", value: 4, path: "/home" },
      // { label: "Patients", value: 6, path: "/event/new-events" },
      // { label: "Invoices", value: 6, path: "/event/new-events" },
      // { label: "Payments", value: 6, path: "/event/new-events" },
      { label: "Settings", value: 7, path: "/settings/settings-menu" },
    ];
  }
}

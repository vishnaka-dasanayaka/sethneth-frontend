import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { signOut } from 'aws-amplify/auth';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  role: string = '';
  showDropdown = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getRole();
  }

  getRole() {
    this.role = localStorage.getItem('role') || '';
  }

  async LogOut() {
    try {
      await signOut();
      localStorage.clear();
      this.router.navigate(['/login']);
      
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  }
}

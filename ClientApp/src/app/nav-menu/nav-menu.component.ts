import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  currentChoice: string = "home";
  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  setActive(choice: string): void{
    this.currentChoice = choice;
  }

  getActive(choice: string) : string{
      if(this.currentChoice == choice)
          return "nav-link active";
      else
          return "nav-link";

  }

}

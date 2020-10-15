import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'lab9';
  SECTION_ACTOR = 0;
  SECTION_MOVIE = 1
  section = 0;

  changeSection(sectionId) {
    this.section = sectionId;
  }
}



import { Component, OnInit } from '@angular/core';
import { DatabaseService } from "../database.service";

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  HOME_SECTION = 1;
  ADD_MOVIE_SECTION = 2;
  DELETE_MOVIE_SECTION = 3;
  DELETE_BEFORE_YEAR_SECTION = 4;
  ADD_ACTOR_MOVIE_SECTION = 5;

  moviesDB: any[] = [];
  actorsDB: any[] = [];

  section = 1;
  title: string = "";
  year: number = 0;
  minYear: number = 0;

  selectedMovie: any = {_id: null};
  selectedActor: any = {_id: null};

  //actorId: string = "";

  constructor(private dbService: DatabaseService) {}
  
  //Get all Movies
  onGetMovies() {
    this.dbService.getMovies().subscribe((data: any[]) => {
      this.moviesDB = data;
      this.assignMinYear();
    });
  }

  //Get all Actors
  onGetActors() {
    this.dbService.getActors().subscribe((data: any[]) => {
      this.actorsDB = data;
    });
  }
  
  //Create a new Movie, POST request
  onSaveMovie() {
    let obj = { title: this.title, year: this.year };
    this.dbService.addMovie(obj).subscribe(result => {
      this.onGetMovies();
    });
  }
  //Delete Movie
  onDeleteMovie(movie) {
    this.dbService.deleteMovie(movie._id).subscribe(result => {
      this.onGetMovies();
    });
  }

  onDeleteBeforeYear(year) {
    this.dbService.deleteMovieBetweenYears({year1: this.minYear, year2: year}).subscribe(result => {
      this.onGetMovies();
    });
  }

  onSelectMovie(movie) {
    this.selectedMovie = movie;
  }

  onSelectActor(actor) {
    this.selectedActor = actor;
  }

  onAddActorToMovie() {
    this.dbService.addActorToMovie(this.selectedMovie._id, this.selectedActor._id).subscribe(result => {
      this.onGetMovies();
    });
    let obj = {id: this.selectedMovie._id}
    this.dbService.addMovieToActor(this.selectedActor._id, obj).subscribe(result => {
      this.onGetActors();
    });
  }
  
  // This lifecycle callback function will be invoked with the component get initialized by Angular.
  ngOnInit() {
    this.onGetMovies();
    this.onGetActors();
  }

  changeSection(sectionId) {
    this.section = sectionId;
    this.resetValues();
  }

  resetValues() {
    this.title = "";
    this.year = 0;
    this.selectedMovie = {_id: null};
    this.selectedActor = {_id: null};
  }

  assignMinYear() {
    this.minYear = this.moviesDB[0].year;
      for (let i = 1; i <= this.moviesDB.length; i++) {
        if (this.moviesDB[i].year < this.minYear) {
          this.minYear = this.moviesDB[i].year
        }
      }
  }

}

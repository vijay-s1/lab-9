import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};
@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  constructor(private http: HttpClient) {}
  result: any;
  getActors() {
    return this.http.get("/actors");
  }

  getActor(id: string) {
    let url = "/actors/" + id;
    return this.http.get(url);
  }

  createActor(data) {
    return this.http.post("/actors", data, httpOptions);
  }

  updateActor(id, data) {
    let url = "/actors/" + id;
    return this.http.put(url, data, httpOptions);
  }

  deleteActor(id) {
    let url = "/actors/" + id;
    return this.http.delete(url, httpOptions);
  }

  addMovieToActor(actorID, data) {
    let url = "/actors/" + actorID + "/movies";
    return this.http.post(url, data, httpOptions);
  }


  getMovies() {
    // Get all movies
    return this.http.get("/movies");
  }

  getMovie(id: string) {
    let url = "/movies/" + id;
    return this.http.get(url);
  }

  addMovie(data) {
    /*
    {
      "title": "T1",
      "year": 2001
    }
    */
    let url = "/movies";
    return this.http.post(url, data, httpOptions);
  }

  deleteMovie(id: string) {
    let url = "/movies/" + id;
    return this.http.delete(url, httpOptions);
  }

  deleteMovieBetweenYears(data) {
    /*
        DELETE /movies/betweenyears 
            {
                "year1": xxxx,
                "year2": xxxx
            }
    */
    let url = "/movies/betweenyears";
    let tempOptions = {headers: httpOptions.headers, body: data}
    return this.http.delete(url, tempOptions);
  }

  addActorToMovie(movieID, actorID) {
    let url = "/movies/" + movieID + "/" + actorID;
    return this.http.post(url, httpOptions);
  }

}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamilyTreeService {

  private apiUrl = 'http://localhost:8080/api/familytree/generate';

  constructor(private http: HttpClient) { }

  generateFamilyTree(input: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, input, { headers: { 'Content-Type': 'application/json' } });
  }
}

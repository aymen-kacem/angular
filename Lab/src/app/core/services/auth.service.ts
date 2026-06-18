import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { Observable, of, BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap, map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private refreshSubject = new BehaviorSubject<void>(undefined);
  public currentUser$: Observable<User | null>;

  constructor(
    private afAuth: AngularFireAuth,
    private http: HttpClient
  ) {
    this.currentUser$ = combineLatest([this.afAuth.authState, this.refreshSubject]).pipe(
      switchMap(([fbUser]) => {
        if (!fbUser) {
          return of(null);
        }
        // Try fetching user by Firebase UID
        return this.http.get<User[]>(`${this.apiUrl}/users?uid=${fbUser.uid}`).pipe(
          switchMap(users => {
            if (users.length > 0) {
              return of(users[0]);
            }
            // Self-healing: if no user is found by UID, search by email
            return this.http.get<User[]>(`${this.apiUrl}/users?email=${fbUser.email}`).pipe(
              switchMap(usersByEmail => {
                if (usersByEmail.length > 0) {
                  const profile = usersByEmail[0];
                  // Automatically patch the profile in db.json with the actual Firebase UID
                  return this.http.patch<User>(`${this.apiUrl}/users/${profile.id}`, { uid: fbUser.uid });
                }
                return of(null);
              })
            );
          })
        );
      }),
      shareReplay(1)
    );
  }


  refreshProfile(): void {
    this.refreshSubject.next();
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.signOut();
  }

  register(email: string, password: string, fullName: string, role: 'teacher' | 'student') {
    return this.afAuth.createUserWithEmailAndPassword(email, password).then(credential => {
      if (!credential.user) {
        throw new Error("Erreur lors de la création de l'utilisateur Firebase.");
      }
      const newUserProfile: Omit<User, 'id'> = {
        uid: credential.user.uid,
        fullName: fullName,
        email: email,
        role: role,
        avatarUrl: ''
      };
      return this.http.post<User>(`${this.apiUrl}/users`, newUserProfile).toPromise();
    });
  }

  getIdToken(): Observable<string | null> {
    return this.afAuth.idToken;
  }
}


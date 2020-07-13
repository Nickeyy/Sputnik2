import { Component, OnInit } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthenticationService} from "../_core/authentication.service";
import * as firebase from "firebase";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  constructor(private firestore: AngularFirestore, private router: Router, private authService: AuthenticationService) { }

  blogsCollection: AngularFirestoreCollection<any>;
  blogs: Observable<any>;
  storyRef: any;
  docsArray = [];
  showSpinner: boolean = false;

  increment = firebase.firestore.FieldValue.increment(1);

  ngOnInit(): void {
    this.blogsCollection = this.firestore.collection('blogs', ref => ref.orderBy("sort_number", "desc"));
    this.blogs = this.blogsCollection.valueChanges();

    this.firestore.collection('blogs', ref => ref.orderBy("sort_number", "desc")).get().subscribe((snapshot) => {
      snapshot.docs.forEach(doc =>{
        this.docsArray.push(doc);
      })
    })
  }

  navigateToDetailView(doc): void {
    this.router.navigate(['/post', {title: doc.data().title}]);
  }

  like (event, doc) {
    event.stopPropagation();
    this.storyRef = this.firestore.collection('blogs').doc(doc.id);
    this.storyRef.update({count: this.increment}).then(d =>{
      this.reloadPage();
    });
  }

  reloadPage(){
    window.location.reload();
    this.showSpinner = true;
  }



}

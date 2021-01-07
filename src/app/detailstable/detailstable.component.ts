import { Component, OnInit ,ViewChild ,Output, EventEmitter } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/firestore';
import {  Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';


export interface details {
  detailno: number;
  email:string;
  phone: number;
  age: number;
}




@Component({
  selector: 'app-detailstable',
  templateUrl: './detailstable.component.html',
  styleUrls: ['./detailstable.component.scss']
})
export class DetailstableComponent implements OnInit {

  private detailcollection:AngularFirestoreCollection<details>;
details:Observable<details[]>;

data:any;
  constructor( private afs :AngularFirestore) {
this.detailcollection=afs.collection<details>('details');
    this.details = this.detailcollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as details;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

   
  displayedColumns: string[] = ['detailno', 'email', 'phone', 'age','actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.getalldetails();
  }

ngAfterViewInit(): void {
  //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
  //Add 'implements AfterViewInit' to the class.
  this.dataSource.sort = this.sort;
}

 getalldetails(){
 this.details.subscribe(res=>{this.dataSource.data=res});
 } 

onedit(element:any){

}

ondelete(id:string){
this.detailcollection.doc(id).delete();
}
@Output() messageEvent = new EventEmitter<string>();

sendeddata(element:any){
   this.data=element;
   this.messageEvent.emit(this.data);
}


}

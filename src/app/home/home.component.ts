import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Calendar, CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { scheduled } from 'rxjs';
import { schedule } from '../models/Schedule';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,AfterViewInit {

  @ViewChild("fullcalendar")calendarComponent!:FullCalendarComponent;

title!:string;
calendarApi!:Calendar;
schedules:schedule[] | any=JSON.parse(localStorage.getItem('dataSource'))
testy:any;
i:number=0;
schedulDetails:any;
form!: FormGroup;
routerId!:any;

model:any;
createform!: FormGroup;
submitted = false;
showToaster:boolean=false;
localStoreData:any=localStorage.getItem('dataSource');
data:any=[this.localStoreData];

months:any=[
  {id:1,month:"January"},
  {id:2,month:"Feburary"},
  {id:3,month:"March"},
  {id:4,month:"April"},
  {id:5,month:"May"},
  {id:6,month:"Jun"},
  {id:7,month:"July"},
  {id:8,month:"August"},
  {id:9,month:"September"},
  {id:10,month:"Octobar"},
  {id:11,month:"November"},
  {id:12,month:"December"},
]

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    events: this.schedules,
    eventClick: this.handleDateClick.bind(this),
  };
  config: any = {
    animated: true,
  }

  constructor(private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private router:Router) { }

  ngOnInit(): void {

    this.createform = this.formBuilder.group(
      {
        firstName: ['', [Validators.required,Validators.maxLength(40)]],
        lastName: [
          '',
          [
            Validators.required,
            Validators.maxLength(40)
          ]
        ],
        email: ['', [Validators.required, Validators.email]],
        gender:[''],
        age:[],
        date:['',Validators.required],
        time:['',Validators.required],
      
      
      }
      
    );
    console.log(this.localStoreData);
    



    this.form = this.formBuilder.group({
      month:['']
    })
   this.routerId=this.route.snapshot.paramMap.get('id');
    
 
   let increment=0;
    for(let i=0;i<this.schedules?.length;i++){
      this.schedules[i].id=increment++;
      this.schedules[i].title=this.schedules[i]['firstName'];
      this.schedules[i].date=this.schedules[i]['date'];
     }
  }

  get f() {
    return this.createform.controls;
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.createform.invalid) {
      return;
    }
    console.log(JSON.stringify(this.createform.value));
      var tempArray=[];
      tempArray =  JSON.parse(localStorage.getItem('dataSource')) || [];
      tempArray.push(this.createform.value);
       console.log('temp array',tempArray);
      
    localStorage.setItem('dataSource',JSON.stringify(tempArray));
    this.onReset();
    
  
  }
  onReset(): void {
    this.submitted = false;
    this.createform.reset();
  }
  refresh(): void {
   
    this.router.navigate(['/home/'+1]);
  }
  

  ngAfterViewChecked(){
    this.calendarApi=this.calendarComponent.getApi();
  }

  findScheduleById(Id:number){
   return this.schedules.find((o:any) => o.id == Id);
  }

  handleDateClick(arg:any) {
    console.log(arg.event.id);
    console.log();
    this.schedulDetails=this.findScheduleById(arg.event.id);
    let ref:any=document.getElementById('modal_button');
    ref.click();
    this.title=arg.event.title;
  }
  cretaeDateClick() {
   
    let ref:any=document.getElementById('modal_button1');
    ref.click();
  }

  onCreateSchedule(){
    //go to create schedule page

  }

  test():void{
    console.log('click');
    
    this.calendarApi.gotoDate('2022-03-01');
  }

  onChangeMonth(value:string){
    console.log('value',value.trim());
    
    let target;
    if(BigInt(value.trim())>9){
     target=`2022-${value}-01`
    }else{
      target=`2022-0${value}-01`
    }
    console.log('value',target);
    this.calendarApi.gotoDate(target);
}

ngAfterViewInit(): void {
  this.calendarApi=this.calendarComponent.getApi();
  if(this.routerId){
    this.form.get('month')?.setValue(this.routerId)
    this.onChangeMonth(this.routerId);
  }
  
}


}
